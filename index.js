const studentForm = document.getElementById("studentForm");
const studentsTable = document.getElementById("studentsTable").querySelector("tbody");

let isEditing = false;
let editingStudentId = null;

studentForm.addEventListener("submit", onSubmit);

function onSubmit(event) {
    event.preventDefault();

    if (isEditing) {
        updateStudent();
    } else {
        addNewStudent();
    }
}

function addNewStudent() {
    const student = {
        id: Date.now(),
        firstName: studentForm.elements.firstName.value,
        lastName: studentForm.elements.lastName.value,
        age: studentForm.elements.age.value,
        course: studentForm.elements.course.value,
        faculty: studentForm.elements.faculty.value,
        courses: studentForm.elements.courseList.value.split(',').map(course => course.trim())
    };

    addStudentToTable(student);
    saveStudentToLocalStorage(student);
    studentForm.reset();
}

function updateStudent() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.id === editingStudentId);

    if (student) {
        student.firstName = studentForm.elements.firstName.value;
        student.lastName = studentForm.elements.lastName.value;
        student.age = studentForm.elements.age.value;
        student.course = studentForm.elements.course.value;
        student.faculty = studentForm.elements.faculty.value;
        student.courses = studentForm.elements.courseList.value.split(',').map(course => course.trim());

        localStorage.setItem('students', JSON.stringify(students));
        renderStudentsTable();
        studentForm.reset();
        isEditing = false;
        editingStudentId = null;
    }
}

function addStudentToTable(student) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.firstName}</td>
        <td>${student.lastName}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td>${student.faculty}</td>
        <td>${student.courses.join(', ')}</td>
        <td>
            <button class="btn btn-warning btn-sm" onclick="editStudent(${student.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteStudent(${student.id})">Delete</button>
        </td>
    `;
    studentsTable.appendChild(row);
}

function saveStudentToLocalStorage(student) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudentsFromLocalStorage() {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    students.forEach(student => addStudentToTable(student));
}

function deleteStudent(id) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.filter(student => student.id !== id);
    localStorage.setItem('students', JSON.stringify(students));
    renderStudentsTable();
}

function editStudent(id) {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(student => student.id === id);

    if (student) {
        studentForm.elements.firstName.value = student.firstName;
        studentForm.elements.lastName.value = student.lastName;
        studentForm.elements.age.value = student.age;
        studentForm.elements.course.value = student.course;
        studentForm.elements.faculty.value = student.faculty;
        studentForm.elements.courseList.value = student.courses.join(', ');

        isEditing = true;
        editingStudentId = id;
    }
}

function renderStudentsTable() {
    studentsTable.innerHTML = '';
    loadStudentsFromLocalStorage();
}

window.deleteStudent = deleteStudent;
window.editStudent = editStudent;
window.onload = loadStudentsFromLocalStorage;
