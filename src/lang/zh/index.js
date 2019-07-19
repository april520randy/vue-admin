import common from './common'
import error from './error'
import login from './login'
import main from './main'
import operator from './operator'
import product from './product'
import systemParameter from './systemParameter'
import thirdPaymentBank from './thirdPaymentBank'
import thirdPointCard from './thirdPointCard'
import wechatOfficialAccount from './wechatOfficialAccount'
import gameConfig from './gameConfig'
import sw from './switch'
import carouselMapConfig from './carouselMapConfig'
import bPreferentialActivityConfig from './bPreferentialActivityConfig'
import merchantConfig from './merchantConfig'
import fuser from './fuser'
import fcircle from './fcircle'
import fkeyword from './fkeyword.js'
import fcircleComments from './fcircleComments'
import flevelSetting from './flevelSetting'
import fgameSetting from './fgameSetting'
import findexSetting from './findexSetting'
import freport from './freport'
import advertisement from './advertisement'
import guessing from './guessing'
import paymentAccount from "./paymentAccount"
import paymentRecord from "./paymentRecord"
import paymentChannel from "./paymentChannel"
import paymentOperationRecord from "./paymentOperationRecord"
import bankQuotaRecord from "./bankQuotaRecord"
import changeBankQuota from "./changeBankQuota"
import bankTransfer from "./bankTransfer"
import bankTransferProposal from './bankTransferProposal'
import permission from './permission'
import whiteListConfig from './whiteListConfig'
import payChannelStatistics from './pay/payChannelStatistics'

export default {
  ...common,
  ...error,
  ...login,
  ...main,
  ...operator,
  ...product,
  ...systemParameter,
  ...thirdPaymentBank,
  ...thirdPointCard,
  ...wechatOfficialAccount,
  ...gameConfig,
  ...sw,
  ...carouselMapConfig,
  ...bPreferentialActivityConfig,
  ...merchantConfig,
  ...fuser,
  ...fcircle,
  ...fkeyword,
  ...fcircleComments,
  ...flevelSetting,
  ...fgameSetting,
  ...findexSetting,
  ...freport,
  ...advertisement,
  ...guessing,
  ...paymentAccount,
  ...paymentRecord,
  ...paymentChannel,
  ...paymentOperationRecord,
  ...bankQuotaRecord,
  ...changeBankQuota,
  ...bankTransfer,
  ...bankTransferProposal,
  ...permission,
  ...whiteListConfig,
  ...payChannelStatistics
}
