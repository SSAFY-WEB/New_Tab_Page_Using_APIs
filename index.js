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
        const hour = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');
        const timeFormat = `${hour}:${minutes}:${second}`;
        timer.textContent = timeFormat;
    }, 1000)
}


setRenderBackground();
setTime();

setInterval(() =>{
    setRenderBackground();
},5000);
