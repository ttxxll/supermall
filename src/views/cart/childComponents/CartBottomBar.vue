<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" :idChecked="isSelectAll" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'
  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    methods: {
      checkClick() {
        if (this.isSelectAll) {
          this.cartList.forEach(element => {
            element.checked = false;
          });
        } else {
          this.cartList.forEach(element => {
            element.checked = true;
          })
        }
      },
      calcClick() {
        if (!this.isSelectAll) {
          this.$toast.show('请选择购买的商品', 2000)
        }
      }
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.$store.state.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if (this.cartList.length === 0) {
          return false;
        }
        return !this.cartList.find(item => !item.checked)
        // for (let item of this.cartList) {
        //   if (!item.checked) {
        //     return false;
        //   }
        // }
        // return true;
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    position: fixed;
    width: 100%;
    bottom: 49px;
    background-color: #eee;
    height: 40px;
    z-index: 9;
    line-height: 40px;
    display: flex;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }

  .price {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background: red;
    color: #fff;
    text-align: center;
  }
</style>