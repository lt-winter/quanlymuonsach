const BookService = require("@/services/book.service");
const MongoDB = require("@/utils/mongodb.util");
const ApiError = require("@/api-error");

exports.findAll = async (req, res, next) => {
  const { sortBy, order, theLoai, page, limit, name } = req.query;
  
  // Debug logs removed
  
  try {
    const bookService = new BookService(MongoDB.client);
    
    // Tạo filter object
    const filter = {};
    
    // Filter theo thể loại nếu có (hỗ trợ nhiều thể loại)
    if (theLoai) {
      const genres = Array.isArray(theLoai) ? theLoai : [theLoai];
      if (genres.length > 0) {
        filter.theLoai = { $all: genres }; // Phải có tất cả thể loại
      }
    }
    
    // Filter theo tên nếu có
    if (name) {
      filter.$or = [
        { tenSach: { $regex: name, $options: 'i' } },
        { tacGia: { $regex: name, $options: 'i' } }
      ];
    }
    
    // Debug logs removed
    
    // Sắp xếp
    const sort = {};
    if (sortBy) {
      const sortOrder = order === "desc" ? -1 : 1;
      sort[sortBy] = sortOrder;
    }
    // Nếu không có sortBy, không sắp xếp (giữ thứ tự mặc định)
    
    // Phân trang
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    
    // Lấy tổng số sách và danh sách sách
    const total = await bookService.count(filter);
    const documents = await bookService.findWithPagination(filter, sort, skip, limitNum);
    
    // Trả về kết quả với thông tin phân trang
    return res.send({
      data: documents,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất sách: ${error.message}`),
    );
  }
};

exports.getNewestBooks = async (req, res, next) => {
  const { limit } = req.query;
  
  try {
    const bookService = new BookService(MongoDB.client);
    
    // Sắp xếp theo _id giảm dần (sách mới nhất đầu tiên)
    const sort = { _id: -1 };
    const limitNum = parseInt(limit) || 8;
    
    // Lấy sách mới nhất, chỉ lấy sách có số lượng > 1
    const filter = { soQuyen: { $gt: 1 } };
    const documents = await bookService.findWithPagination(filter, sort, 0, limitNum);
    
    return res.send({
      data: documents,
      pagination: {
        total: documents.length,
        limit: limitNum,
        count: documents.length
      }
    });
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất sách mới nhất: ${error.message}`),
    );
  }
};

exports.getRandomBooks = async (req, res, next) => {
  const { limit } = req.query;
  
  try {
    const bookService = new BookService(MongoDB.client);
    
    const limitNum = parseInt(limit) || 8;
    
    // Lấy sách ngẫu nhiên, chỉ lấy sách có số lượng > 1
    const filter = { soQuyen: { $gt: 1 } };
    const documents = await bookService.Sach.aggregate([
      { $match: filter },
      { $sample: { size: limitNum } }
    ]).toArray();
    
    return res.send({
      data: documents,
      pagination: {
        total: documents.length,
        limit: limitNum,
        count: documents.length
      }
    });
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất sách ngẫu nhiên: ${error.message}`),
    );
  }
};

exports.getGenres = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    
    // Lấy tất cả genres duy nhất từ tất cả sách
    const genres = await bookService.getDistinctGenres();
    
    return res.send({
      data: genres
    });
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất thể loại: ${error.message}`),
    );
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Sách không tồn tại"));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Đã xảy ra lỗi khi truy xuất sách: ${error.message}`),
    );
  }
};
