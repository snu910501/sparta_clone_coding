const ViewRepository = require("../repositories/view.repository");
const dayjs = require("dayjs");

class ViewService {
  viewRepository = new ViewRepository();

  viewCount = async (address, postId) => {
    try {
      const now = dayjs(new Date());
      const findView = await this.viewRepository.findView(address, postId);

      // 조회한적 없으면 조회수 추가
      if (!findView) {
        await this.viewRepository.addView(address, postId);
        return true;
      }

      // DB 저장 시간이 9시간 전이므로 날짜 처리
      const viewed = dayjs(findView.createdAt);
      viewed.add(9, "hour");

      // 조회한지 하루 이상 지났으면 조회수 추가
      if (now.diff(viewed, "day", true) >= 1) {
        await this.viewRepository.addView(address, postId);
        return true;
      } else {
        return true;
      }
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ViewService;
