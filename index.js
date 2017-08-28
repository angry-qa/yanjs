var form = document.querySelector('#myForm');
var submitButton = form.querySelector('#submitButton');
var resultContainer = document.querySelector('#resultContainer');
form.addEventListener('submit', function(event){
    event.preventDefault();
    resultContainer.textContent = '';
    MyForm.submit();
});

var MyForm = {
    validate: function() {
        var result = {
            isValid: true,
            errorFields: []
        }
        var arFields = Array.from(form.querySelectorAll('input[type="text"]'));
        var arCheck = {
            fio: /^(([a-zA-Zа-яА-ЯёЁ]+)\ ){2}([a-zA-Zа-яА-ЯёЁ]+){1}$/,
            email: /^([a-z0-9_.-]+)@((ya\.ru)|((yandex)\.(ru|ua|by|kz|com)))$/,
            phone: /^\+7\([\d]{3}\)[\d]{3}\-[\d]{2}\-[\d]{2}$/
        }
        for(var i = 0; i < arFields.length; i++){
            var field = arFields[i];
            var regExp = arCheck[field.name];
            if(!regExp.test(field.value)){
                result.isValid = false;
                field.classList.add('error');
                result.errorFields.push(field.name);
            } else{
                field.classList.remove('error');
            }
            if(field.name === 'phone' && result.errorFields.indexOf('phone') === -1) {
                var sum = 0;
                var maxSum = 30;
                var splitPhone = field.value.split('');
                for(var i = 0; i < splitPhone.length; i++){
                    if(parseInt(splitPhone[i])){
                        sum += parseInt(splitPhone[i]);
                    }
                }
                console.log('phone sum: ', sum);
                if(sum > maxSum){
                    result.isValid = false;
                    field.classList.add('error');
                    result.errorFields.push(field.name);
                }
            }
        }
        return result;
    },
    getData: function(){
        var data = {};
        var arFields = Array.from(form.querySelectorAll('input[type="text"]'));
        for(var i = 0; i < arFields.length; i++){
            data[arFields[i].name] = arFields[i].value;
        }
        return data;
    },
    setData: function(data){
        var inputList = ['phone', 'fio', 'email'];
        for(var i in data){
            if(inputList.indexOf(i) !== -1){
                form[i].value = data[i];
            }
        }
    },
    submit: function(){
        var response = this.validate();
        console.log(response);
        if(response.isValid){
            submitButton.setAttribute('disabled', 'disabled');
            req(form.action);
        }
    }
};

function req(url){
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.addEventListener('load', function(){
        var response = JSON.parse(this.responseText);
        console.log('response: ', response);
        if (response.status === 'progress'){
            setTimeout(req, response.timeout, url);
        }else if(response.status === 'success'){
            resultContainer.classList.remove('error');
            resultContainer.classList.add('success');
            resultContainer.textContent = 'Success';
            //submitButton.removeAttribute('disabled');
        } else if(response.status === 'error'){
            resultContainer.classList.add('error');
            resultContainer.textContent = response.reason;
            //submitButton.removeAttribute('disabled');
        } else {
            return;
        }
    })
    request.send();
}