function addToCart(proId){
    $.ajax({
        url:'/addtoCart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
               let count=$('#cart-count') .html()
               count=parseInt(count)+1
               $("#cart-count").html(count)
            }
            
            
        }
    })
}
/*function buynow(proId){
    $.ajax({
        url:'users/place-order/'+proId,
        method:'post',
        success:(response)=>{
            
            }
            
        }
    })
}*/
