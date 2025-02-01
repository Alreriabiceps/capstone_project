document.getElementById('customerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const location = document.getElementById('location').value;
    const date_of_installment = document.getElementById('date_of_installment').value;
    const gender = document.getElementById('gender').value;

    const table = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.insertCell(0).appendChild(document.createTextNode(name));
    newRow.insertCell(1).appendChild(document.createTextNode(age));
    newRow.insertCell(2).appendChild(document.createTextNode(location));
    newRow.insertCell(3).appendChild(document.createTextNode(date_of_installment));
    newRow.insertCell(4).appendChild(document.createTextNode(gender));

    const actionsCell = newRow.insertCell(5);
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        // Edit customer logic
    });
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        table.deleteRow(newRow.rowIndex - 1);
    });
    actionsCell.appendChild(deleteButton);

    document.getElementById('customerForm').reset();
});
