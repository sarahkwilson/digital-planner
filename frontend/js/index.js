const today = document.querySelector(".current-date");

const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const todayDate = new Date().toLocaleDateString("en-AU", options);

today.innerHTML = todayDate;

const url = "https://digital-planner-backend.vercel.app/todos";
document.querySelector(".todo-form").addEventListener("submit", async (e) => {
	e.preventDefault();
	const text = document.querySelector(".new-task").value;

	try {
		await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
		});
		location.reload(); // Simple refresh to show new todo
	} catch (error) {
		console.error(error);
	}
});

async function getTodos() {
	try {
		const response = await fetch(url);
		const todos = await response.json();
		const todoContainer = document.querySelector(".todo-items");

		todoContainer.innerHTML = ""; // Clear existing items

		todos.forEach((todo) => {
			const newTask = document.createElement("li");
			newTask.innerHTML = todo.text;

			const buttonDiv = document.createElement("div");
			buttonDiv.className = "btns";

			const deleteButton = document.createElement("button");
			deleteButton.innerHTML = "Delete";
			deleteButton.addEventListener("click", async () => {
				try {
					await fetch(`${url}/${todo._id}`, { method: "DELETE" });
					location.reload();
				} catch (error) {
					console.error(error);
				}
			});

			const updateButton = document.createElement("button");
			updateButton.innerHTML = "Update";
			updateButton.addEventListener("click", () => {
				const newText = prompt("Enter new text:", todo.text);
				if (newText) {
					fetch(`${url}/${todo._id}`, {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ text: newText }),
					}).then(() => location.reload());
				}
			});

			buttonDiv.appendChild(deleteButton);
			buttonDiv.appendChild(updateButton);
			newTask.appendChild(buttonDiv);
			todoContainer.appendChild(newTask);
		});
	} catch (error) {
		console.log(error);
	}
}
// Call getTodos at the end
getTodos();