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
        let greetings = "";
        if (5 <= hour && hour < 12)
            greetings = "Good Morning, USER";
        else if (12 <= hour && hour < 18)
            greetings = "Good Afternoon, USER";
        else
            greetings = "Good Evening, USER";
        document.querySelector(".timer-content").innerHTML = greetings;
        
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
            e.target.value="";
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



// 날씨 파트
const key ="97e6f42e74244c99353edcf2c4d0133e";
// 도시명으로 API 호출하는 법
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}

// 위도 경도로 API 호출하는 법
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}


// 위도 경도 받아오기
function getPosition(options){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
}


	
function matchIcon(weatherData) {
    if (weatherData === "Clear") return "./images/039-sun.png";
    if (weatherData === "Clouds") return "./images/001-cloud.png";
    if (weatherData === "Rain") return "./images/003-rainy.png";
    if (weatherData === "Snow") return "./images/006-snowy.png";
    if (weatherData === "Thunderstorm") return "./images/008-storm.png";
    if (weatherData === "Drizzle") return "./images/031-snowflake.png";
    if (weatherData === "Atmosphere") return "./images/033-hurricane.png";
}

// 273.15를 빼고 소수점 한자리까지만 보여주게 만든다.
const changeToCelsius = temp => (temp -273.15).toFixed(1);


function weatherWrapperComponent(cur){
    // console.log(cur);
    // cur.dt의 타임스탬프 = Unix timestamp
    // JS의 timestamp로 변환하기 위해 Unix timestamp * 1000
    // 또한, api로 받은 cur.dt는 GMT 기준 -> KST로 바꾸기 위해 9시간 차이 반영
    const timeStamp = new Date(cur.dt * 1000 - 32400000);
    console.log(timeStamp);
    const day_num = timeStamp.getDay();
    const day_list = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
   
    return `
        <div class="card bg-transparent flex-grow-1 m-2">
            <div class="card-header text-center">
                ${cur.dt_txt.split(" ")[0]} (${day_list[day_num]})
            </div>
            <div class="card-body text-center">
                <h5 class="card-title">${cur.weather[0].main}</h5>
                <img width="60px" height="60px" src="${matchIcon(cur.weather[0].main)}">
                <p class="card-text">${changeToCelsius(cur.main.temp)}˚</p>
            </div>
        </div>
    `
}

async function renderWeather(){
    // 위치 정보를 승인 O
    let latitude="";
    let longitude="";
    let weatherData = null;
    try{
        const position = await getPosition();
        // console.log(position.coords);
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        // console.log(latitude, longitude);
        const result = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`);
        // console.log(result.data);
        weatherData = result.data;

        // 위치 정보 승인 X
    } catch(error){
        // console.log(error);
        if(!latitude || !longitude) {
            // console.log("test");
            const result = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=seoul&appid=${key}`);
            // console.log(result);
            weatherData = result.data;
        }
    }

    // console.log(weatherData);
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if(cur.dt_txt.indexOf("18:00:00") > 0){
            acc.push(cur);
        }
        return acc;
    }, [])

    console.log(weatherList);
    const weatherComponents = weatherList.reduce((acc, cur) => {
        acc = acc + weatherWrapperComponent(cur);
        console.log(cur.weather[0].main);
        curWeatherIcon(cur.weather[0].main);
        return acc;
    }, "")

    // console.log(weatherComponents);
    document.querySelector(".modal-body").insertAdjacentHTML('beforeend', weatherComponents);

    // 날씨 카드 첫번째 요소 선택 (첫번째 요소 = 오늘)
    const todayWeatherCard = document.querySelector(".card.bg-transparent.flex-grow-1.m-2");
    todayWeatherCard.classList.add("border", "border-warning", "border-3");
    todayWeatherCard.classList.remove("bg-transparent");
    todayWeatherCard.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

}

// 우측 상단 날씨 아이콘을 현재 날씨와 맞게 바꾸기
function curWeatherIcon(weatherUrl){
    const weatherButton = document.querySelector('.modal-button');
    weatherButton.style.backgroundImage = `url(${matchIcon(weatherUrl)})`;    
}




// 명언 파트
function setQuote(){
    const quoteURL = "https://type.fit/api/quotes";
    const result = axios.get(quoteURL);
    result.then((data) => {
        // console.log(data);
        const quote = data.data[getRandomInt(0, 1643)];
        // console.log(quote);
        document.querySelector(".quote-wrapper").insertAdjacentHTML('beforeend',quoteWrapperComponent(quote));
    });
}

function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

function quoteWrapperComponent(quote){
    // console.log(quote);
    return `
    <div class="quote-content fs-4"> "${quote.text}" </div>
    `;
}



setRenderBackground();
setTime();
setMemo();
getMemo();
deleteMemo();
renderWeather();
setQuote();

setInterval(() =>{
    setRenderBackground();
},5000);
