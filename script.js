// =============================
// Google Sheets API
// =============================

const API_URL = "https://script.google.com/macros/s/AKfycbxfO2j_rjDcv0lpsPiAoXeEDHogiF2OgrWUVFTNPrAQ22_zK1MMgRsFeWGea75SvvCR/exec";

let students = [];

// عناصر الصفحة
const phoneInput = document.getElementById("phoneInput");
const searchBtn = document.getElementById("searchBtn");

const result = document.getElementById("result");
const notFound = document.getElementById("notFound");
const container = document.querySelector(".container");
// =============================
// تحميل البيانات من Google Sheets
// =============================

async function loadStudents() {

    try {

        searchBtn.disabled = true;
        searchBtn.innerHTML = "⏳ جارٍ تحميل البيانات...";

        const response = await fetch(API_URL);

        students = await response.json();

        console.log("عدد الطلاب:", students.length);

        searchBtn.disabled = false;
        searchBtn.innerHTML = `
            <i class="fa-solid fa-magnifying-glass"></i>
            استعلام
        `;

    } catch (error) {

        console.error(error);

        alert("تعذر تحميل بيانات الطلاب.\nتأكد من اتصال الإنترنت.");

    }

}

loadStudents();

// =============================
// البحث عند الضغط على الزر
// =============================

searchBtn.addEventListener("click", searchStudent);

// البحث عند الضغط على Enter

phoneInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        searchStudent();

    }

});

// =============================
// تنظيف رقم الهاتف
// =============================

function cleanPhone(phone) {

    return String(phone)
        .replace(/[^\d]/g, "")
        .replace(/^0+/, "");

}

// =============================
// البحث
// =============================
function displayStudent(student){

    result.classList.remove("hidden");
    notFound.classList.add("hidden");

    document.getElementById("studentCode").textContent = student.code;
    document.getElementById("studentName").textContent = student.name;
    document.getElementById("studentGrade").textContent = student.grade;
    document.getElementById("studentGroup").textContent = student.group;
    document.getElementById("studentStart").textContent = student.start;
    document.getElementById("studentTime").textContent = student.time;
    document.getElementById("studentWhatsapp").textContent = student.studentWhatsapp;
    document.getElementById("parentWhatsapp").textContent = student.parentWhatsapp;

}

function showStudentList(list){

    result.classList.add("hidden");
    notFound.classList.add("hidden");

    let old=document.getElementById("studentList");

    if(old) old.remove();

    let html=`
        <div id="studentList" class="student-card">
            <h2 style="margin-bottom:20px">
            تم العثور على ${list.length} طلاب
            </h2>
    `;

    list.forEach((student,index)=>{

        html+=`
            <button
                class="student-select"
                onclick="displayStudent(students[${students.indexOf(student)}])">

                ${student.name}
                <br>
                <small>${student.grade}</small>

            </button>

            <br><br>
        `;

    });

    html+="</div>";

    container.insertAdjacentHTML("beforeend",html);

}
function searchStudent() {

    const phone = cleanPhone(phoneInput.value);

    const matchedStudents = students.filter(s =>

        cleanPhone(s.studentWhatsapp) === phone ||

        cleanPhone(s.parentWhatsapp) === phone

    );

    if(matchedStudents.length===1){

        let old=document.getElementById("studentList");

        if(old) old.remove();

        displayStudent(matchedStudents[0]);

    }

    else if(matchedStudents.length>1){

        showStudentList(matchedStudents);

    }

    else{

        let old=document.getElementById("studentList");

        if(old) old.remove();

        result.classList.add("hidden");
        notFound.classList.remove("hidden");

    }

}