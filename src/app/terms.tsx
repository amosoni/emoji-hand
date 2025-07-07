import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow mt-8">
      <h1 className="text-3xl font-bold mb-4">服务条款</h1>
      <p className="mb-4">欢迎使用 Emoji Hand（以下简称“本网站”或“我们”）。请您在使用本网站前仔细阅读本服务条款，使用本网站即表示您同意本条款的全部内容。</p>
      <h2 className="text-xl font-bold mt-6 mb-2">1. 服务内容</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>本网站为用户提供 AI 表情符号翻译、会员服务、配额管理等数字服务。</li>
        <li>部分功能仅对会员用户开放，普通用户有每日免费额度限制。</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">2. 用户义务</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>用户应遵守国家法律法规，不得利用本网站从事违法违规活动。</li>
        <li>用户不得上传、传播违法、侵权、低俗等内容。</li>
        <li>用户应妥善保管账号信息，因账号泄露造成的损失由用户自行承担。</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">3. 会员与配额</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>会员服务为付费订阅，会员有效期内享有每日更高配额和更多功能。</li>
        <li>会员到期后自动降为普通用户，配额恢复为普通额度。</li>
        <li>配额每日自动重置，会员与普通用户配额不同。</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">4. 支付与退款</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>所有支付由第三方平台（如 Creem）处理，我们不存储您的支付卡信息。</li>
        <li>会员服务为数字商品，购买后不支持无理由退款，特殊情况请联系客服邮箱。</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">5. 免责声明</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>本网站致力于提供稳定服务，但不保证服务不会中断或无错误。</li>
        <li>因不可抗力或第三方原因导致的服务中断、数据丢失等，本网站不承担责任。</li>
      </ul>
      <h2 className="text-xl font-bold mt-6 mb-2">6. 争议解决</h2>
      <p className="mb-4">因本服务条款产生的争议，双方应友好协商解决，协商不成时，可向本网站运营方所在地法院提起诉讼。</p>
      <h2 className="text-xl font-bold mt-6 mb-2">7. 联系方式</h2>
      <p className="mb-4">如有任何服务相关问题，请通过页面底部显示的客服邮箱与我们联系。</p>
      <h2 className="text-xl font-bold mt-6 mb-2">8. 条款变更</h2>
      <p>我们有权根据实际情况修改本服务条款，变更后将在本页面公示，用户继续使用即视为同意变更内容。</p>
    </div>
  );
} 