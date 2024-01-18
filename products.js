import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.4.14/vue.esm-browser.min.js';
let myProductModal='';
let myDelModal='';
let app={
  data(){
    return{
     apiUrl:'https://ec-course-api.hexschool.io/v2',
     api_path:'pangpang',
     products:[],
     isNew:false,
     tempProduct:{
        imagesUrl:[]
     }
    };
  },
  mounted(){
   const productModal=document.querySelector('#productModal');
   myProductModal = new bootstrap.Modal(productModal,{
    keyboard: false,
    backdrop: 'static'
  });
   const delProductModal=document.querySelector('#delProductModal');
   myDelModal=new bootstrap.Modal(delProductModal,{
    keyboard: false,
    backdrop: 'static'
  });

   const token=document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
   axios.defaults.headers.common.Authorization = token;
   this.checkLogin();
  },
  methods:{
    checkLogin(){
      const url=`${this.apiUrl}/api/user/check`;
      axios.post(url)
      .then((res)=>{
         this.getProducts();
      })
      .catch((err)=>{
        console.dir(err);
        alert(err.data.message);
        window.location='./login.html';
      });
    },
    openModal(identify,item){
       if(identify==='add'){
         this.tempProduct={
            imagesUrl:[]
         };
         this.isNew=true;
         myProductModal.show();
       }else if(identify==='edit'){
         this.tempProduct={...item};
         this.isNew=false;
         myProductModal.show();
       }else if(identify==='del'){
        this.tempProduct={...item}
         myDelModal.show();
       }
    },
    getProducts(){
      const url=`${this.apiUrl}/api/${this.api_path}/admin/products`;
      axios.get(url)
      .then((res)=>{
         this.products=res.data.products;
      })
      .catch((err)=>{
        alert(err.response.message);
      });
    },
    addProduct(){
      const url=`${this.apiUrl}/api/${this.api_path}/admin/product`;
      axios.post(url,{data:this.tempProduct})
      .then((res)=>{
         console.log(res);
         alert(res.data.message);
         myProductModal.hide();
         this.getProducts();
      })
      .catch((err)=>{
          console.dir(err);
          let str='';
          err.data.message.forEach((item) => {
            str+=item;
          });
          alert(str);
      });
    },
    editProduct(){
      const id=this.tempProduct.id;
      const url=`${this.apiUrl}/api/${this.api_path}/admin/product/${id}`;
      const obj={
        data:this.tempProduct
      }
      axios.put(url,obj)
      .then((res)=>{
        alert(res.data.message);
        myProductModal.hide();
        this.getProducts();
      })
      .catch((err)=>{
         console.dir(err);
         let str='';
          err.data.message.forEach((item) => {
            str+=item;
          });
          alert(str);
      });
    },
    delProduct(){
     const id =this.tempProduct.id;
     const url=`${this.apiUrl}/api/${this.api_path}/admin/product/${id}`;
     axios.delete(url)
     .then((res)=>{
       console.log(res);
       alert(res.data.message);
       myDelModal.hide();
       this.getProducts();
     })
     .catch((err)=>{
         alert(err.data.message);
         myDelModal.hide();
     });
    },
    createImgList(){
        this.tempProduct.imagesUrl=[];
        this.tempProduct.imagesUrl.push('');
      }
  }
};
createApp(app).mount('#app');