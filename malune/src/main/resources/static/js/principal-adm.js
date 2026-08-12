document.addEventListener('DOMContentLoaded', () => {
    // Proteção da rota: exige tipo ADMINISTRADOR e o token emitido no login
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    const adminToken = sessionStorage.getItem('malune_admin_token');
    if (tipoUsuario !== 'ADMINISTRADOR' || !adminToken) {
        encerrarSessaoAdmin();
        return;
    }

    function encerrarSessaoAdmin() {
        sessionStorage.removeItem('malune_admin_token');
        sessionStorage.removeItem('malune_admin');
        localStorage.removeItem('tipo_usuario');
        localStorage.removeItem('id_usuario');
        window.location.replace('login.html');
    }

    const state = { products: [], stock: [], orders: [], statuses: [] };
    const menuButtons = document.querySelectorAll('.menu-list button[data-target]');
    const viewSections = document.querySelectorAll('.view-section');
    const headerTitle = document.getElementById('header-title');
    const sideBarTitle = document.getElementById('sidebar-title');
    const feedback = document.getElementById('admin-feedback');

    const byId = (id) => document.getElementById(id);

    function setFeedback(message, isError = false) {
        if (!feedback) return;
        feedback.textContent = message || '';
        feedback.classList.toggle('error', isError);
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function formatCurrency(value) {
        return Number(value || 0).toLocaleString('pt-BR', {
            style: 'currency', currency: 'BRL'
        });
    }

    function formatDate(value) {
        if (!value) return '—';
        const parts = String(value).split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
    }

    // Toda chamada ao painel envia o token de admin no header Authorization
    async function apiFetch(path, options = {}) {
        const headers = new Headers(options.headers || {});
        if (options.body && !headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
        headers.set('Authorization', `Bearer ${adminToken}`);

        const response = await fetch(path, { ...options, headers });

        if (response.status === 401) {
            encerrarSessaoAdmin();
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(data?.error || 'Não foi possível concluir a operação.');
        }
        return data;
    }

    function renderRecentOrders(orders) {
        const body = byId('recent-orders-body');
        if (!body) return;
        if (!orders?.length) {
            body.innerHTML = '<tr><td colspan="2">Nenhum pedido encontrado.</td></tr>';
            return;
        }
        body.innerHTML = orders.map(order => `
            <tr>
                <td>#${escapeHtml(order.id)} — ${escapeHtml(formatDate(order.dataPedido))}</td>
                <td style="text-align: right;">${escapeHtml(formatCurrency(order.valorTotal))}
                    <span class="badge-green">${escapeHtml(order.status || 'Sem status')}</span>
                </td>
            </tr>
        `).join('');
    }

    async function loadDashboard() {
        const dashboard = await apiFetch('/admin/api/dashboard');
        byId('total-products').textContent = dashboard.totalProducts ?? 0;
        byId('total-orders').textContent = dashboard.totalOrders ?? 0;
        byId('total-users').textContent = dashboard.totalUsers ?? 0;
        byId('total-revenue').textContent = formatCurrency(dashboard.revenue);
        renderRecentOrders(dashboard.recentOrders || []);
    }

    function renderProducts() {
        const body = byId('products-body');
        const query = (byId('product-search')?.value || '').trim().toLowerCase();
        const products = state.products.filter(product => product.nome?.toLowerCase().includes(query));
        if (!products.length) {
            body.innerHTML = '<tr><td colspan="5">Nenhum produto encontrado.</td></tr>';
            return;
        }
        body.innerHTML = products.map(product => `
            <tr>
                <td><strong>${escapeHtml(product.nome)}</strong><br><small>${escapeHtml(product.descricao)}</small></td>
                <td>${escapeHtml(formatCurrency(product.valorUnitario))}</td>
                <td>${escapeHtml(product.categoria?.categoria || 'Sem categoria')}</td>
                <td>${escapeHtml(product.qtdEstoque)}</td>
                <td style="text-align: right;">
                    <button class="btn-small-outline js-edit-product" data-id="${product.id}" type="button">Editar</button>
                    <button class="btn-small-red js-delete-product" data-id="${product.id}" type="button">Excluir</button>
                </td>
            </tr>
        `).join('');

        body.querySelectorAll('.js-edit-product').forEach(button => {
            button.addEventListener('click', () => openProductDialog(Number(button.dataset.id)));
        });
        body.querySelectorAll('.js-delete-product').forEach(button => {
            button.addEventListener('click', () => deleteProduct(Number(button.dataset.id)));
        });
    }

    async function loadProducts() {
        state.products = await apiFetch('/admin/api/products');
        renderProducts();
    }

    function renderStock() {
        const body = byId('stock-body');
        const query = (byId('stock-search')?.value || '').trim().toLowerCase();
        const products = state.stock.filter(product => product.nome?.toLowerCase().includes(query));
        if (!products.length) {
            body.innerHTML = '<tr><td colspan="3">Nenhum produto encontrado.</td></tr>';
            return;
        }
        body.innerHTML = products.map(product => `
            <tr>
                <td>${escapeHtml(product.nome)}</td>
                <td><input class="table-input js-stock-value" data-id="${product.id}" type="number" min="0" value="${escapeHtml(product.qtdEstoque ?? 0)}"></td>
                <td><button class="btn-small-pink js-save-stock" data-id="${product.id}" type="button">Salvar</button></td>
            </tr>
        `).join('');
        body.querySelectorAll('.js-save-stock').forEach(button => {
            button.addEventListener('click', () => saveStock(Number(button.dataset.id)));
        });
    }

    async function loadStock() {
        state.stock = await apiFetch('/admin/api/stock');
        renderStock();
    }

    function renderOrders() {
        const body = byId('orders-body');
        const query = (byId('order-search')?.value || '').trim().toLowerCase();
        const orders = state.orders.filter(order =>
            String(order.id).includes(query) || (order.status || '').toLowerCase().includes(query)
        );
        if (!orders.length) {
            body.innerHTML = '<tr><td colspan="5">Nenhum pedido encontrado.</td></tr>';
            return;
        }
        body.innerHTML = orders.map(order => {
            const statuses = [...state.statuses];
            if (order.status && !statuses.some(item => item.status === order.status)) {
                statuses.push({ status: order.status });
            }
            const options = statuses.map(item => `
                <option value="${escapeHtml(item.status)}" ${item.status === order.status ? 'selected' : ''}>${escapeHtml(item.status)}</option>
            `).join('');
            return `
                <tr>
                    <td>#${escapeHtml(order.id)}</td>
                    <td>${escapeHtml(formatDate(order.dataPedido))}</td>
                    <td>${escapeHtml(formatCurrency(order.valorTotal))}</td>
                    <td><select class="table-select js-order-status" data-id="${order.id}">${options}</select></td>
                    <td><button class="btn-small-pink js-save-order" data-id="${order.id}" type="button">Salvar</button></td>
                </tr>
            `;
        }).join('');
        body.querySelectorAll('.js-save-order').forEach(button => {
            button.addEventListener('click', () => saveOrderStatus(Number(button.dataset.id)));
        });
    }

    async function loadOrders() {
        const [orders, statuses] = await Promise.all([
            apiFetch('/admin/api/orders'),
            apiFetch('/admin/api/orders/statuses')
        ]);
        state.orders = orders || [];
        state.statuses = statuses || [];
        renderOrders();
    }

    async function saveStock(id) {
        const input = document.querySelector(`.js-stock-value[data-id="${id}"]`);
        const quantity = Number(input?.value);
        if (!Number.isInteger(quantity) || quantity < 0) {
            setFeedback('Informe uma quantidade de estoque válida.', true);
            return;
        }
        try {
            await apiFetch(`/admin/api/stock/${id}`, {
                method: 'PUT', body: JSON.stringify({ qtdEstoque: quantity })
            });
            setFeedback('Estoque atualizado com sucesso.');
            await Promise.all([loadStock(), loadProducts(), loadDashboard()]);
        } catch (error) {
            setFeedback(error.message, true);
        }
    }

    async function saveOrderStatus(id) {
        const select = document.querySelector(`.js-order-status[data-id="${id}"]`);
        try {
            await apiFetch(`/admin/api/orders/${id}/status`, {
                method: 'PUT', body: JSON.stringify({ status: select.value })
            });
            setFeedback('Status do pedido atualizado com sucesso.');
            await Promise.all([loadOrders(), loadDashboard()]);
        } catch (error) {
            setFeedback(error.message, true);
        }
    }

    function openProductDialog(productId = null) {
        const dialog = byId('product-dialog');
        const product = state.products.find(item => item.id === productId);
        byId('product-dialog-title').textContent = product ? 'Editar produto' : 'Adicionar produto';
        byId('product-id').value = product?.id || '';
        byId('product-name').value = product?.nome || '';
        byId('product-description').value = product?.descricao || '';
        byId('product-price').value = product?.valorUnitario ?? '';
        byId('product-category').value = product?.categoria?.id || '';
        byId('product-stock').value = product?.qtdEstoque ?? 0;
        dialog.showModal();
    }

    function closeProductDialog() {
        byId('product-dialog').close();
    }

    async function saveProduct(event) {
        event.preventDefault();
        const id = byId('product-id').value;
        const category = byId('product-category').value;
        const payload = {
            nome: byId('product-name').value.trim(),
            descricao: byId('product-description').value.trim(),
            valorUnitario: Number(byId('product-price').value),
            qtdEstoque: Number(byId('product-stock').value)
        };
        if (category) payload.categoriaId = Number(category);
        try {
            await apiFetch(id ? `/admin/api/products/${id}` : '/admin/api/products', {
                method: id ? 'PUT' : 'POST', body: JSON.stringify(payload)
            });
            closeProductDialog();
            setFeedback('Produto salvo com sucesso.');
            await Promise.all([loadProducts(), loadStock(), loadDashboard()]);
        } catch (error) {
            setFeedback(error.message, true);
        }
    }

    async function deleteProduct(id) {
        if (!window.confirm('Deseja excluir este produto?')) return;
        try {
            await apiFetch(`/admin/api/products/${id}`, { method: 'DELETE' });
            setFeedback('Produto excluído com sucesso.');
            await Promise.all([loadProducts(), loadStock(), loadDashboard()]);
        } catch (error) {
            setFeedback(error.message, true);
        }
    }

    async function loadSection(targetId) {
        try {
            if (targetId === 'dashboard') await loadDashboard();
            if (targetId === 'produtos') await loadProducts();
            if (targetId === 'estoque') await loadStock();
            if (targetId === 'pedidos') await loadOrders();
            setFeedback('');
        } catch (error) {
            setFeedback(error.message, true);
        }
    }

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            menuButtons.forEach(item => item.classList.remove('active'));
            viewSections.forEach(section => section.classList.remove('active'));
            button.classList.add('active');
            byId(targetId).classList.add('active');
            const title = targetId.charAt(0).toUpperCase() + targetId.slice(1);
            headerTitle.textContent = title;
            sideBarTitle.textContent = title;
            loadSection(targetId);
        });
    });

    byId('product-search')?.addEventListener('input', renderProducts);
    byId('stock-search')?.addEventListener('input', renderStock);
    byId('order-search')?.addEventListener('input', renderOrders);
    byId('btn-add-product')?.addEventListener('click', () => openProductDialog());
    byId('product-form')?.addEventListener('submit', saveProduct);
    byId('btn-close-product')?.addEventListener('click', closeProductDialog);
    byId('btn-cancel-product')?.addEventListener('click', closeProductDialog);

    byId('btn-sair')?.addEventListener('click', () => {
        localStorage.removeItem('id_usuario');
        localStorage.removeItem('tipo_usuario');
        window.location.replace('login.html');
    });

    loadSection('dashboard');
});