let taskList = []; 

if(localStorage.getItem("taskList") !== null)
{
    taskList = JSON.parse(localStorage.getItem("taskList"));
}


let editId;
let isEditTask = false;
const taskInput =document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span")

displayTasks("all");

function displayTasks(filter){
    let ul = document.getElementById("task-list"); 
    ul.innerHTML="";     
    
    if(taskList.length == 0)
    {
        ul.innerHTML = "<p class='p-3 m-0'> Görev listeniz boş </p>"
    }else{
        for(let task of taskList)
    {

        let completed = task.durum == "completed" ? "checked": "";
        
        if(filter == task.durum || filter == "all")
        {
            let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input type="checkbox" onclick="updateStatus(this)" id="${task.id}" class="form-check-input" ${completed}>
                    <label for="${task.id}" class="form-check-label ${completed}">
                        ${task.taskName}</label>
                </div> 
                <div class="dropdown">
                    <a class="btn btn-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </a>

                    <ul class="dropdown-menu">
                        <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can-arrow-up"></i> Sil</a></li>
                        <li><a onclick='editTask(${task.id},"${task.taskName}")'
                            class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
                        
                    </ul>
                </div>                       
            </li>         
             `;  
             ul.insertAdjacentHTML("beforeend",li);
        }

      
    }
    }


    
}


  document.querySelector("#btnAddNewTask").addEventListener("click",newTask);
  document.querySelector("#btnAddNewTask").addEventListener("keypress",function(){
    if(event.key == "Enter")
    {
        document.getElementById("btnAddNewTask").click;
    }
  });

 
  
  for(let span of filters)
  {
    span.addEventListener("click",function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
  }



function newTask(event){
    
    if(taskInput.value == ""){
        alert("görev girmelisiniz.");
    }else{
        if(!isEditTask)
        {
            //ekleme
            taskList.push({"id": taskList.length + 1, "taskName": taskInput.value,"durum": "pending"}); 
            
        }else{
            //güncelleme
            for(let task of taskList)
            {
                if(task.id == editId)
                {
                    task.taskName = taskInput.value;                         
                   
                }
                isEditTask = false;
            }

        }
        
        taskInput.value="";
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("taskList", JSON.stringify(taskList));
        console.log(taskList);
    }

  
   


    event.preventDefault();
};


function deleteTask(id){
    let deletedindex;
   

   deletedindex = taskList.findIndex(function(task){
       return task.id == id;              
    }) 



    taskList.splice(deletedindex, 1);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks(document.querySelector("span.active").id);
}



function editTask(taskId, taskName)
{
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
    taskInput.classList.add("active");        
}

btnClear.addEventListener("click", function(){
    taskList.splice(0, taskList.length);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    displayTasks("all");

})

function updateStatus(selectedTask)
{
   let label = selectedTask.nextElementSibling; 
   let durum;
  // console.log(selectedTask.parentElement.lastElementChild); 
  if(selectedTask.checked)
  {
    label.classList.add("checked");
    durum = "completed";
  }else{
    label.classList.remove("checked");
    durum = "pending";
  }  

  for(let task of taskList)
  {
    if(task.id == selectedTask.id)
    {
       task.durum = durum;
    }
  }

  displayTasks(document.querySelector("span.active").id);  
  localStorage.setItem("taskList", JSON.stringify(taskList));
}
