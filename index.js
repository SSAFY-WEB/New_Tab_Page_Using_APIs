// 이미지 설정 파트
const imageURL = "https://picsum.photos/1280/720";
function setRenderBackground(){
    // 이미지, 사운도, 비디오등을 통신하는 경우에는 blob (Binary Large OBject)이라는 속성을 사용
    const result = axios.get(imageURL, {
        responseType: 'blob'
    });
    result.then(data => {
        // console.log(data);
        // console.log(data.data);
        // 해당 이미지 덩어리를 "임시" URL을 만들어서 접근이 가능하게 한다
        const image = URL.createObjectURL(data.data);
        // console.log(image);
        document.querySelector('body').style.backgroundImage = `url(${image})`;
    });
}


// 시계 설정 파트
function setTime(){
    const timer = document.querySelector('.timer');
    
    setInterval(() => {
        const date = new Date();
        // console.log(date);
        const hour = String(date.getHours());
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const timeFormat = `${hour}:${minutes}:${second}`;
        timer.textContent = timeFormat;
    }, 1000)
}

// 메모 파트
function setMemo(){
    const memoInput = document.querySelector('.memo-input');
    memoInput.addEventListener('keyup', function(e){
        // console.log(e);
        // console.log(e.target.value);
        // 메모 입력란에 내용이 있고, Enter키를 눌렀다면
        if ((e.code === 'Enter' || e.code === 'NumpadEnter') && e.target.value){
            // memo.textContent = e.target.value;
            localStorage.setItem('todo', e.target.value);
            getMemo();
        }
    });
}

function getMemo(){
    const memo = document.querySelector('.memo');
    const memoValue = localStorage.getItem('todo');
    memo.textContent = memoValue;
}

function deleteMemo(){
    document.addEventListener('click',(e)=>{
        // console.log(e.target);
        if(e.target.classList.contains('memo')){
            e.target.textContent = "";
            localStorage.removeItem('todo');
        }
    })
}

setRenderBackground();
setTime();
setMemo();
getMemo();
deleteMemo();

setInterval(() =>{
    setRenderBackground();
},5000);
