class ReportService {
  constructor(client) {
    this.client = client;
    this.TheoDoiMuonSach = client.db().collection("theodoimuonsach");
    this.Sach = client.db().collection("sach");
    this.DocGia = client.db().collection("docgia");
  }

  // Thống kê tổng quan
  async getOverviewStats(startDate = null, endDate = null) {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.ngayMuon = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const [borrowStats, readerCount, bookCount] = await Promise.all([
      this.TheoDoiMuonSach.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: null,
            totalBorrows: { $sum: 1 },
            activeBorrows: {
              $sum: { $cond: [{ $eq: ["$trangThai", "dangMuon"] }, 1, 0] },
            },
            returnedBorrows: {
              $sum: { $cond: [{ $eq: ["$trangThai", "daTra"] }, 1, 0] },
            },
            lostBooks: {
              $sum: { $cond: [{ $eq: ["$trangThai", "matSach"] }, 1, 0] },
            },
            totalFines: { $sum: "$tienPhat" },
            totalCompensation: { $sum: "$tienBoiThuong" },
          },
        },
      ]).toArray(),
      this.DocGia.countDocuments(),
      this.Sach.countDocuments(),
    ]);

    const stats = borrowStats[0] || {
      totalBorrows: 0,
      activeBorrows: 0,
      returnedBorrows: 0,
      lostBooks: 0,
      totalFines: 0,
      totalCompensation: 0,
    };

    return {
      tongLuotMuon: stats.totalBorrows,
      dangMuon: stats.activeBorrows,
      daTraSach: stats.returnedBorrows,
      sachMat: stats.lostBooks,
      tongTienPhat: stats.totalFines,
      tongDocGia: readerCount,
      tongSach: bookCount,
    };
  }

  // Top 5 sách được mượn nhiều nhất
  async getTopBorrowedBooks(startDate = null, endDate = null, limit = 5) {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.ngayMuon = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return await this.TheoDoiMuonSach.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: "$maSach",
          borrowCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "sach",
          localField: "_id",
          foreignField: "maSach",
          as: "sach",
        },
      },
      { $unwind: "$sach" },
      { $sort: { borrowCount: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          maSach: "$_id",
          tenSach: "$sach.tenSach",
          tacGia: "$sach.tacGia",
          theLoai: "$sach.theLoai",
          soQuyen: "$sach.soQuyen",
          soLuotMuon: "$borrowCount",
        },
      },
    ]).toArray();
  }

  // Thống kê sách quá hạn/mất
  async getOverdueAndLostStats(startDate = null, endDate = null) {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.ngayMuon = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const today = new Date();
    const LOAN_PERIOD_DAYS = 14;

    const [overdueBooks, lostBooks] = await Promise.all([
      // Sách quá hạn (đang mượn và quá 14 ngày)
      this.TheoDoiMuonSach.aggregate([
        {
          $match: {
            trangThai: "dangMuon",
            ...(Object.keys(matchStage).length > 0 ? matchStage : {}),
          },
        },
        {
          $addFields: {
            hanTra: {
              $dateAdd: {
                startDate: "$ngayMuon",
                unit: "day",
                amount: LOAN_PERIOD_DAYS,
              },
            },
          },
        },
        {
          $match: {
            hanTra: { $lt: today },
          },
        },
        {
          $lookup: {
            from: "sach",
            localField: "maSach",
            foreignField: "maSach",
            as: "sach",
          },
        },
        { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "docgia",
            localField: "maDocGia",
            foreignField: "maDocGia",
            as: "docGia",
          },
        },
        { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            maMuon: 1,
            maSach: 1,
            maDocGia: 1,
            ngayMuon: 1,
            book: { tenSach: "$sach.tenSach" },
            reader: {
              hoLot: "$docGia.hoLot",
              ten: "$docGia.ten",
            },
            soNgayQuaHan: {
              $divide: [
                { $subtract: [today, "$hanTra"] },
                1000 * 60 * 60 * 24,
              ],
            },
          },
        },
        { $sort: { soNgayQuaHan: -1 } },
      ]).toArray(),

      // Sách mất
      this.TheoDoiMuonSach.aggregate([
        {
          $match: {
            trangThai: "matSach",
            ...(Object.keys(matchStage).length > 0 ? matchStage : {}),
          },
        },
        {
          $lookup: {
            from: "sach",
            localField: "maSach",
            foreignField: "maSach",
            as: "sach",
          },
        },
        { $unwind: { path: "$sach", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "docgia",
            localField: "maDocGia",
            foreignField: "maDocGia",
            as: "docGia",
          },
        },
        { $unwind: { path: "$docGia", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            maMuon: 1,
            maSach: 1,
            maDocGia: 1,
            ngayMuon: 1,
            book: { tenSach: "$sach.tenSach" },
            reader: {
              hoLot: "$docGia.hoLot",
              ten: "$docGia.ten",
            },
            tienBoiThuong: 1,
          },
        },
        { $sort: { ngayMuon: -1 } },
      ]).toArray(),
    ]);

    return {
      overdue: overdueBooks.map((b) => ({
        ...b,
        soNgayQuaHan: Math.ceil(b.soNgayQuaHan),
      })),
      lost: lostBooks,
    };
  }

  // Phân bố sách theo thể loại
  async getBooksByCategory() {
    return await this.Sach.aggregate([
      {
        $group: {
          _id: "$theLoai",
          soLuong: { $sum: 1 },
          tongSoQuyen: { $sum: "$soQuyen" },
        },
      },
      { $sort: { soLuong: -1 } },
    ]).toArray();
  }

  // Số lượt mượn theo thời gian
  async getBorrowTrend(period = "day", startDate = null, endDate = null) {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.ngayMuon = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    let dateFormat;
    let groupId;

    switch (period) {
      case "day":
        dateFormat = "%Y-%m-%d";
        groupId = { $dateToString: { format: dateFormat, date: "$ngayMuon" } };
        break;
      case "week":
        groupId = {
          year: { $year: "$ngayMuon" },
          week: { $week: "$ngayMuon" },
        };
        break;
      case "month":
        dateFormat = "%Y-%m";
        groupId = { $dateToString: { format: dateFormat, date: "$ngayMuon" } };
        break;
      case "year":
        groupId = { $year: "$ngayMuon" };
        break;
      default:
        dateFormat = "%Y-%m-%d";
        groupId = { $dateToString: { format: dateFormat, date: "$ngayMuon" } };
    }

    const result = await this.TheoDoiMuonSach.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: groupId,
          soLuotMuon: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).toArray();

    return result.map((item) => ({
      _id: period === "week" ? `${item._id.year}-W${item._id.week}` : item._id,
      soLuotMuon: item.soLuotMuon,
    }));
  }

  // Thống kê độc giả tích cực
  async getTopReaders(startDate = null, endDate = null, limit = 10) {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.ngayMuon = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return await this.TheoDoiMuonSach.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: "$maDocGia",
          soLuotMuon: { $sum: 1 },
          tongTienPhat: { $sum: "$tienPhat" },
        },
      },
      {
        $lookup: {
          from: "docgia",
          localField: "_id",
          foreignField: "maDocGia",
          as: "docGia",
        },
      },
      { $unwind: "$docGia" },
      { $sort: { soLuotMuon: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          maDocGia: "$_id",
          hoLot: "$docGia.hoLot",
          ten: "$docGia.ten",
          dienThoai: "$docGia.dienThoai",
          soLuotMuon: 1,
          tongTienPhat: 1,
        },
      },
    ]).toArray();
  }

  // Thống kê thu nhập từ phạt/bồi thường
  async getRevenueStats(startDate = null, endDate = null) {
    const matchStage = {};
    if (startDate && endDate) {
      matchStage.ngayMuon = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const result = await this.TheoDoiMuonSach.aggregate([
      ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
      {
        $group: {
          _id: null,
          tongTienPhat: { $sum: "$tienPhat" },
          tongTienBoiThuong: { $sum: "$tienBoiThuong" },
        },
      },
    ]).toArray();

    const stats = result[0] || {
      tongTienPhat: 0,
      tongTienBoiThuong: 0,
    };

    return {
      tongTienPhat: stats.tongTienPhat,
      tongTienBoiThuong: stats.tongTienBoiThuong,
      tongDoanhThu: stats.tongTienPhat + stats.tongTienBoiThuong,
    };
  }
}

module.exports = ReportService;
