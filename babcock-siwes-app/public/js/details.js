const school = document.getElementById('school-id')

school.addEventListener('change', function () {
    const schoolId = this.value;

    fetch(`/departments?schoolid=${schoolId}`).then(response => response.json()).then(data => {
        const departmentSelect = document.getElementById('department-id');

        data.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            departmentSelect.appendChild(option);
        });
    })
});
