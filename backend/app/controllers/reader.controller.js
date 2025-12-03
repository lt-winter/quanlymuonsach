const ReaderService = require("@/services/reader.service");
const MongoDB = require("@/utils/mongodb.util");
const ApiError = require("@/api-error");
const jwt = require("jsonwebtoken");

exports.create = async (req, res, next) => {
  if (!req.body?.hoLot) {
    return next(new ApiError(400, "Họ lót không được để trống"));
  }
  if (!req.body?.ten) {
    return next(new ApiError(400, "Tên không được để trống"));
  }
  if (!req.body?.ngaySinh) {
    return next(new ApiError(400, "Ngày sinh không được để trống"));
  }
  if (!req.body?.phai) {
    return next(new ApiError(400, "Phái không được để trống"));
  }
  if (!req.body?.diaChi) {
    return next(new ApiError(400, "Địa chỉ không được để trống"));
  }
  if (!req.body?.dienThoai) {
    return next(new ApiError(400, "Số điện thoại không được để trống"));
  }
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi thêm độc giả: ${error.message}`),
    );
  }
};

exports.findAll = async (req, res, next) => {
  const { sortBy, order } = req.query;
  let documents = [];
  try {
    const readerService = new ReaderService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await readerService.findByName(name);
    } else {
      const sort = {};
      if (!sortBy) sort["_id"] = order === "desc" ? -1 : 1;
      else sort[sortBy] = order === "desc" ? -1 : 1;

      documents = await readerService.find({}, sort);
    }
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi lấy danh sách độc giả: ${error.message}`,
      ),
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Reader not found"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(
        500,
        `Có lỗi xảy ra khi lấy độc giả có id=${req.params.id}: ${error.message}`,
      ),
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu để cập nhật không được để trống"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "Độc giả không tồn tại"));
    }
    return res.send({ message: "Độc giả đã được cập nhật thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi cập nhật độc giả với id=${req.params.id}`),
    );
  }
};
exports.delete = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.delete(req.params.id);

    if (!document) {
      return next(new ApiError(404, "Độc giả không tồn tại"));
    }

    return res.send({ message: "Độc giả đã được xóa thành công" });
  } catch (error) {
    return next(
      new ApiError(500, `Lỗi khi xóa độc giả với id=${req.params.id}`),
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const deletedCount = await readerService.deleteAll();

    return res.send({
      message: `${deletedCount} độc giả đã được xóa thành công`,
    });
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi xóa tất cả độc giả`));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { maDocGia, matKhau } = req.body;

    if (!maDocGia || !matKhau) {
      return next(new ApiError(400, "Vui lòng nhập mã độc giả và mật khẩu"));
    }

    const readerService = new ReaderService(MongoDB.client);
    const user = await readerService.login(maDocGia, matKhau);

    if (!user) {
      return next(new ApiError(401, "Sai mã độc giả hoặc mật khẩu"));
    }

    // Tạo token
    const token = jwt.sign(
      {
        id: user._id,
        maDocGia: user.maDocGia,
      },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" },
    );

    return res.send({
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        maDocGia: user.maDocGia,
        hoLot: user.hoLot,
        ten: user.ten,
        dienThoai: user.dienThoai,
        diaChi: user.diaChi,
        phai: user.phai,
        ngaySinh: user.ngaySinh,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi đăng nhập"));
  }
};

exports.register = async (req, res, next) => {
  if (!req.body?.hoLot) {
    return next(new ApiError(400, "Họ lót không được để trống"));
  }
  if (!req.body?.ten) {
    return next(new ApiError(400, "Tên không được để trống"));
  }
  if (!req.body?.ngaySinh) {
    return next(new ApiError(400, "Ngày sinh không được để trống"));
  }
  if (!req.body?.phai) {
    return next(new ApiError(400, "Phái không được để trống"));
  }
  if (!req.body?.diaChi) {
    return next(new ApiError(400, "Địa chỉ không được để trống"));
  }
  if (!req.body?.dienThoai) {
    return next(new ApiError(400, "Số điện thoại không được để trống"));
  }
  if (!req.body?.matKhau) {
    return next(new ApiError(400, "Mật khẩu không được để trống"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const result = await readerService.register(req.body);
    
    // Lấy thông tin độc giả vừa tạo
    const newReader = await readerService.findById(result.insertedId);

    // Tạo token
    const token = jwt.sign(
      {
        id: newReader._id,
        maDocGia: newReader.maDocGia,
      },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" },
    );

    return res.send({
      message: "Đăng ký thành công",
      user: {
        _id: newReader._id,
        maDocGia: newReader.maDocGia,
        hoLot: newReader.hoLot,
        ten: newReader.ten,
        dienThoai: newReader.dienThoai,
        diaChi: newReader.diaChi,
        phai: newReader.phai,
        ngaySinh: newReader.ngaySinh,
      },
      token,
    });
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi đăng ký: ${error.message}`),
    );
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const profile = await readerService.getProfile(req.user.id);

    if (!profile) {
      return next(new ApiError(404, "Không tìm thấy thông tin độc giả"));
    }

    return res.send(profile);
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi lấy thông tin profile"));
  }
};

exports.updateProfile = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được để trống"));
  }

  try {
    const readerService = new ReaderService(MongoDB.client);
    const updatedProfile = await readerService.updateProfile(req.user.id, req.body);

    if (!updatedProfile) {
      return next(new ApiError(404, "Không tìm thấy thông tin độc giả"));
    }

    return res.send({
      message: "Cập nhật thông tin thành công",
      data: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Lỗi khi cập nhật profile"));
  }
};

// exports.findAllFavorite = async (req, res, next) => {
//   try {
//     const readerService = new ReaderService(MongoDB.client);
//     const document = await readerService.findFavorite();
//     if (!document) {
//       return next(new ApiError(404, "Contact not found"));
//     }
//     return res.send(document);
//   } catch (error) {
//     return next(
//       new ApiError(500, `An error occurred while retrieving favorite contacts`),
//     );
//   }
// };
