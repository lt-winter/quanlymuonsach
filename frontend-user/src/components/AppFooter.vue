<template>
  <footer class="bg-dark text-light py-4 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h5><i class="fas fa-book-reader"></i> Thư viện</h5>
          <p class="text-muted">Hệ thống quản lý mượn sách trực tuyến</p>
        </div>
        <div class="col-md-3">
          <h6>Liên kết</h6>
          <ul class="list-unstyled">
            <li>
              <router-link to="/" class="text-muted">Trang chủ</router-link>
            </li>
            <li>
              <router-link to="/books" class="text-muted">Sách</router-link>
            </li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6>Liên hệ</h6>
          <ul class="list-unstyled text-muted">
            <li><i class="fas fa-phone"></i> 0988 337 191</li>
            <li><i class="fas fa-envelope"></i> winterlibrary9304@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr class="bg-secondary" />
      <p class="text-center text-muted mb-0">
        &copy; {{ new Date().getFullYear() }} Thư viện. All rights reserved.
      </p>
    </div>
  </footer>
</template>
