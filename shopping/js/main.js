(function (MODULE, $, undefined) {
    var itemObj = {},
		activeBlock = {'isBag':true},
		activeObj = {};
		
	var _this = this;
	
	
	$.log = function (message) {
        if ((typeof window.console !== 'undefined' && typeof window.console.log !== 'undefined') && console.debug) {
            console.debug(message);
        } else {
            //alert(message);
        }
    };
	
	//not used
    var bindEvent = function(element, type, listener){        	
		if (element.addEventListener) {
			element.addEventListener(type, listener, false);
		} else if (element.attachEvent) {
			element.attachEvent('on' + type, listener);
		}        	
    };
	
	var displayTotal = function(){
		$("#subTotal").html(itemObj.subTotal);		
		$("#estimatedTotal").html(itemObj.subTotal);
	};
	
	var renderPopupTemplate = function(jsonObj){
		var source = document.querySelector("#popup_template").innerHTML;		
			//Compile that baby into a template
		template = Handlebars.compile(source);		
		var html = template(jsonObj);		
		document.querySelector("#popup_box").innerHTML = html;
	};
	
	var renderSliderTemplate = function(dataObject){
		var source = document.querySelector("#slider_template").innerHTML;		
			//Compile that baby into a template
		template = Handlebars.compile(source);		
		var html = template(dataObject);		
		document.querySelector("#slider_html").innerHTML = html;
	}
	
	var renderTemplate = function(data, section){
		if((data.item.length) || (section == true)){
			var source = document.querySelector("#section_1_template").innerHTML;		
			//Compile that baby into a template
			template = Handlebars.compile(source);		
			var html = template(data);		
			document.querySelector("#section_1").innerHTML = html;
		}else{
			//document.querySelector("#section_1").innerHTML = 'No Records found!';
		}
		if((data.saveLaterObj.length) || (section == false)){
			var source = document.querySelector("#section_3_template").innerHTML;		
			//Compile that baby into a template
			template = Handlebars.compile(source);		
			var html = template(data);		
			document.querySelector("#section_3").innerHTML = html;
		}else{
			//document.querySelector("#section_3").innerHTML = 'No Records found!';
		}
	};
	
	var calculateTotal = function(itemObject){
		if(itemObject.item.length){
			itemObject.subTotal = 0;
			$.each(itemObject.item, function(index, result) {				
				if((result != undefined)){
					itemObject.subTotal += (result.price*result.qty);
				}
			});
			resetData('itemObj', itemObject);
		}
	};
	
	var findAndRemove = function(array, property, value) {
		if(activeBlock.isBag === true){			
			if(array.item.length){
				$.each(array.item, function(index, result) {				
					if((result != undefined)){				
						if(result.id == value){				
							array.subTotal = (array.subTotal) - (result.price*result.qty);
							array.item.splice(index, 1);							
						}
					}
				});
				itemObj = array;
			}
			resetData('itemObj', array);
		}else{			
			if(array.saveLaterObj.length){
				$.each(array.saveLaterObj, function(index, result) {				
					if((result != undefined)){						
						if(result.id == value){
							array.saveLaterObj.splice(index, 1);							
						}
					}
				});
				itemObj = array;
			}			
			resetData('itemObj', array);
		}
	};
	
	var resetBagItem = function(itemFlag, itemObject, moveItem){		
		if(itemFlag){			
			itemObject.subTotal = itemObject.subTotal - (moveItem.qty*moveItem.price);
			itemObject.saveLaterObj.push(moveItem);
		}else{			
			itemObject.item.push(moveItem);
			itemObject.subTotal = itemObject.subTotal + (moveItem.qty*moveItem.price);
		}
		resetData('itemObj', itemObject);
		renderTemplate(itemObject, itemFlag);
	};
	
	var resetData = function(name, jsonData){
		if(typeof jsonData === 'object'){			
			localStorage.setItem(name, JSON.stringify(jsonData));
		}		
		displayTotal(); //todisplayTotal		
	};	
	
	
	var setData = function(items){
		itemObj = {"item":[{"id":1,"title":"SOLID SHIRT V-NECK COTTON","description":"","style":"MS13KT1906","color":"Red","size":"M","qty":"2","price":30,"prompCode":"SAPIENT","image":"image_1.png"},{"id":2,"title":"CROP TOP OPTICAL PATTERN WEAVE","description":"","style":"MS13KT1906","color":"Gray","size":"S","qty":"2","price":40,"prompCode":"SAPIENT","image":"image_2.png"},{"id":3,"title":"FLOWER PATTERN SHIRT","description":"","style":"MS13KT1906","color":"Blue","size":"M","qty":"2","price":15,"prompCode":"SAPIENT","image":"image_3.png"},{"id":4,"title":"PAISLY JEAN","description":"","style":"MS13KT1906","color":"Red","size":"L","qty":"1","price":100,"prompCode":"SAPIENT","image":"image_4.png"},],"saveLaterObj":[{"id":5,"title":"STRIPED BOAT","description":"","style":"MS13KT1906","color":"WHITE", "size":"S","qty":"1","price":10,"prompCode":"SAPIENT","image":"image_5.png"}],"subTotal":270};
				
		if(localStorage.itemObj === undefined){			
			localStorage.setItem('itemObj', JSON.stringify(itemObj));
		}else{			
			itemObj = JSON.parse(localStorage.getItem('itemObj'));
			//renderTemplate(itemObj);			
		}
		
		renderTemplate(itemObj);
				
		if(itemObj.item.length){
			renderSliderTemplate(itemObj);
		}
	}
    
	/**
     * Public methods and properties
     */
	 
	MODULE.init = function(){	
		setData();
		
		$(document).on("click", ".sRemove, .addToBag, .sEditItem", function(){			
			activeBlock.isBag = false;
			if($(this).hasClass('sRemove')){
				MyApp.remƒoveItem($(this).attr('id'), this);
			}
			if($(this).hasClass('addToBag')){
				MyApp.saveItem($(this).attr('id'), this);
			}
			if($(this).hasClass('sEditItem')){				
				popup.open(this);
				$("#popup_block input").addClass('sTextBox');			
			}						
		});		
		
		$(document).on("click", ".removeItem, .editItem, .saveForLater, .viewDetail", function(){				
			activeBlock.isBag = true;
			if($(this).hasClass('removeItem')){
				MyApp.removeItem($(this).attr('id'), this);
			}
			if($(this).hasClass('editItem')){
				popup.open(this);
				$("#popup_block input").addClass('textBox');
			}
			if($(this).hasClass('saveForLater')){
				MyApp.saveItem($(this).attr('id'), this);
			}
			if($(this).hasClass('viewDetail')){							
				popup.open(this);				
				$("#popup_block input").addClass('textBox');			
			}
		});
		
		$(document).on("change", "#size", function(){
			var id = $("#active_popup_id").val();
			MyApp.updateItemSize(this, id);			
		});
				
		$(document).on("change", "#item_table input, #save_later_table input, #popup_block input", function(){
			if($(this).hasClass('textBox')){
				activeBlock.isBag = true;
				if(this.value != 0){
					var id = $("#active_popup_id").val();
					if(id != ''){							
						$("#txtBox"+id).val(this.value);
					}
					MyApp.updateItem(this, $("#item_table input").length);
				}else{
					return false;
				}
			}else if($(this).hasClass('sTextBox')){
				activeBlock.isBag = false;				
				if(this.value != 0){
					var id = $("#active_popup_id").val();
					if(id != ''){							
						$("#sTxtBox"+id).val(this.value);
					}
					MyApp.updateItem(this, $("#save_later_table input").length);
				}else{
					return false;
				}
			}else{
				return false;
			}			
		});
		
		$(document).on("click", "#popupBoxClose", function(){
			popup.close();
		});
				
		displayTotal();		
	};
		
    MODULE.openPopup = function(){
	};
		
	/* give id to parent to remove*/
	MODULE.removeItem = function(param, which){		
		$(which).parent().parent().parent('td').parent().remove();
		findAndRemove(itemObj, 'id', param);
		/*if(activeBlock.isBag == true){
			if(itemObj.item.length){
				renderSliderTemplate(itemObj);
			}
		}*/
	};
	
	MODULE.saveItem = function(index){
		var saveItem;
				
		if(activeBlock.isBag == true){					
			saveItem = itemObj.item[index];
			itemObj.item.splice(index, 1);			
		}else{
			saveItem = itemObj.saveLaterObj[index];
			itemObj.saveLaterObj.splice(index, 1);			
		}
		resetBagItem(activeBlock.isBag, itemObj, saveItem);
	};
	
	MODULE.updateItem = function(which, length){
		var newQty;
		if(activeBlock.isBag == true){	
			if(which.value !=0){
				for(var i=0; i<length; i++){
					newQty = document.getElementById("txtBox"+i).value;
					itemObj.item[i].qty = newQty;
				}
				calculateTotal(itemObj);
			}else{
				//this.value = itemObj.item[this].qty
				return false;
			}
		}else{
			if(which.value !=0){
				for(var i=0; i<length; i++){
					newQty = document.getElementById("sTxtBox"+i).value;
					itemObj.saveLaterObj[i].qty = newQty;
				}
				resetData('itemObj', itemObj);
			}else{
				//this.value = itemObj.item[this].qty
				return false;
			}		
		}			
	};
	
	MODULE.updateItemSize = function(which, index){
		if(activeBlock.isBag == true){
			itemObj.item[index].size = which.value;
			resetData('itemObj', itemObj);	
		}else{
			itemObj.saveLaterObj[index].size = which.value;
			resetData('itemObj', itemObj);
		}
		renderTemplate(itemObj);		
	};
	
	MODULE.loadData = function(id){		
		if(activeBlock.isBag == true){
			activeObj = itemObj.item[id];
			renderPopupTemplate(itemObj.item[id]);
			//console.log(itemObj.item[id]);
		}else{
			activeObj = itemObj.saveLaterObj[id];
			renderPopupTemplate(itemObj.saveLaterObj[id]);
		}
	};
	
/**
 * Check to evaluate whether 'MODULE' exists in the global namespace - if not, assign window.MODULE an object literal
 */
}(window.MyApp = window.MyApp || {}, jQuery));

//console.log(MyApp);
MyApp.init();
