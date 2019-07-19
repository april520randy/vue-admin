import LangSelect from '@/components/LangSelect'
import ProductSelect from '@/components/ProductSelect'
import {login} from 'api'
import MenuUtil from '@/utils/MenuUtil'

export default {
  components: {LangSelect, ProductSelect},
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        productCode: '',
        imageCode: ''
      },
      passwordType: 'password',
      verificationCodeImgUrl: '/api/verificationCode?time=' + Math.random(),
      loginTitle: this.getI18nLocale() === 'en' ? 'login-title-en' : 'login-title-zh',
      rules: {
        username: [
          {required: true, message: this.$t('login.message.usernamenull'), trigger: 'blur'}
        ],
        password: [
          {required: true, message: this.$t('login.message.passwordnull'), trigger: 'blur'}
        ],
        productCode: [
          {required: true, message: this.$t('login.message.productcodenull'), trigger: 'blur'}
        ],
        imageCode: [
          {required: true, message: this.$t('login.message.imagecodenull'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          login.login(this.loginForm).then((response) => {
            if (response.data['code'] === '10000') {
              window.sessionStorage.setItem('operator', JSON.stringify(response.data['data']['operator']));
              window.sessionStorage.setItem('router', JSON.stringify(response.data['data']['routerList']));
              window.sessionStorage.setItem('button', JSON.stringify(response.data['data']['buttonList']));
              let routers = [];
              MenuUtil(routers, response.data['data']['routerList']);
              this.$store.dispatch('generateRoutes', routers);
              this.$router.addRoutes(routers);
              this.$router.push({path: '/'});
              this.$message.success(this.$t('login.message.loginsuccess'));
            } else {
              let messageKey = this.global.getMessageKey(response.data['code']);
              this.$message({message: this.$t(messageKey), type: 'error'});
            }
          })
        } else {
          return false;
        }
      })
    },
    handleVerificationCode() {
      this.verificationCodeImgUrl = '/api/verificationCode?time=' + Math.random();
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    }
  }
}
