### 📦 1. Quản lý Database (Migrations)

Sử dụng các lệnh này để đồng bộ cấu trúc Entity trong code với Database.

- `npx mikro-orm migration:status` : Kiểm tra các migration nào đã/chưa được thực thi 
- `npx mikro-orm migration:create` : Tạo file migration mới dựa trên sự khác biệt giữa Entity và DB hiện tại 
- `npx mikro-orm migration:up` : Thực thi tất cả migration chưa chạy (đưa DB lên phiên bản mới nhất) 
- `npx mikro-orm migration:down` : Chạy ngược lại migration gần nhất (rollback từng bước một) 

---

### 🛠 2. EntityManager (em)

Sử dụng thông qua `private readonly em: EntityManager` được inject vào Service.

#### 🔍 Truy vấn dữ liệu (Read)
- `em.find(User, { gender: 1 })`: Tìm danh sách user theo điều kiện.
- `em.findOne(User, { id: 1 })`: Tìm 1 bản ghi (trả về `null` nếu không thấy).
- `em.findOneOrFail(User, 1)`: Tìm 1 bản ghi, ném lỗi **404** nếu không thấy.

#### ✍️ Thêm & Sửa (Create & Update)
- `em.create(User, dto)`: Tạo instance mới (chưa lưu, chưa theo dõi).
- `em.persist(user)`: Đăng ký theo dõi Entity mới (đưa vào danh sách chờ).
- `user.assign(dto)`: Gán nhanh dữ liệu mới vào một Entity đã tồn tại.

#### 🗑️ Xóa dữ liệu (Delete)
- `em.remove(user)`: Đánh dấu xóa Entity (cần gọi `flush` để thực thi).
- `em.nativeDelete(User, { id: 1 })`: Xóa trực tiếp trong DB (nhanh, không cần load).

#### ⚡ Cập nhật trực tiếp (Native Update)
- `em.nativeUpdate(User, { id: 1 }, { status: 'active' })`: Cập nhật trực tiếp xuống DB mà không cần load Entity lên RAM.

- Lấy danh sách sản phẩm, kèm người tạo và sắp xếp giảm dần theo `created_at`
```ts
await em.find(Product, {}, {
  populate: ['createdBy'],
  orderBy: { created_at: 'DESC' },
});
```

---

### 💡 3. Quy trình Persist & Flush

Đây là cơ chế quan trọng nhất của MikroORM để tối ưu hiệu năng (Unit of Work).

> [!IMPORTANT]
> - **`em.persist(entity)`**: Thêm vào danh sách theo dõi (chưa ghi xuống DB).
> - **`await em.flush()`**: Thực thi tất cả lệnh SQL chờ xử lý và lưu chính thức xuống DB.

**Sơ đồ tư duy nhanh:**
- **Khi tạo mới:** `create` ➔ `persist` ➔ `flush`.
- **Khi cập nhật:** Sửa thuộc tính ➔ `flush` (Entity lấy từ DB lên đã được tự động persist).

---