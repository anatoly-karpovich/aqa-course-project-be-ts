import { Request, Response } from "express";

class PromocodesController {
  async getPromocodeByName(req: Request, res: Response) {
    const promorodes = {
      ["HOT-COURSE"]: 10, //+
      ["NO-PYTHON"]: 8, //+
      ["JAVA-FOR-BOOMERS"]: 7, //+
      ["15-PERCENT-FOR-CSS"]: 15, //+
      ["HelloThere"]: 20, //+ HASH SHA 1: 9c4218e5d95c7b3dafe8d0053b0a4e8671eb9b62
      ["5-PERCENT-FOR-UTILS"]: 5, //+
      ["10-PERCENT-FOR-REDEEM"]: 10,
    };
    try {
      const codeNameFromRequest = req.params.id;
      const foundPromorode = promorodes[codeNameFromRequest];
      if (!foundPromorode) {
        return res.status(404).json({ IsSuccess: false, ErrorMessage: `Unknown promocode` });
      }
      return res.status(200).json({ Code: { codeName: codeNameFromRequest, rebate: foundPromorode }, IsSuccess: true, ErrorMessage: null });
    } catch (e: any) {
      res.status(500).json({ IsSuccess: false, ErrorMessage: e.message });
    }
  }
}

export default new PromocodesController();
