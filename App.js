const APIKEY = "ba3def8fe6394cd1b12a99ca25171adf";
const height = document.querySelector("#height");
const weight = document.querySelector("#weight");
const age = document.querySelector("#age");
const gender = document.querySelector("#gender");
const activity = document.querySelector("#activity__level");
const form = document.querySelector(".user_form");
const submit_btn = document.querySelector("#submit-btn");
const meal_card = document.querySelector("#meal_card");
const recipie__display = document.querySelector("#recipies_sec");
//create link
const lunch_url ="https://i.ndtvimg.com/i/2017-08/indian-food_650x400_81501923865.jpg";
const breakFast_url ="https://asset20.ckassets.com/blog/wp-content/uploads/sites/5/2019/12/Onion-Dosa.jpg";
const dinner_url ="https://b.zmtcdn.com/data/o2_assets/52eb9796bb9bcf0eba64c643349e97211634401116.png";
const images_links = [breakFast_url, lunch_url, dinner_url];
// user form section
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isNaN(weight.value.trim())) {
        alert("please enter the valid number in (kg) ");
        weight.focus();
        return;
    }
    else if (isNaN(height.value.trim())) {
        alert("please enter the valid number in (cm)");
        height.focus();
        return;
    }
    else if (isNaN(age.value.trim())) {
        alert("please enter the valid age number ");
        age.focus();
        return;
    }
    if (gender.value !== "" && activity.value !== "") {
        meal_card.innerHTML = `<div id="processing"></div>`
        const data = BMR(gender.value, height.value, weight.value, age.value);
        const calories = data * (+activity.value);
        //   console.log(calories)
        let respons = await fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${APIKEY}&timeFrame=day&targetCalories=${calories}`);
        let mealData = await respons.json();
         console.log(mealData);
         create_cards(mealData)
        // document.querySelector(".welcome").style.display = "none"
    }
    else {
        alert("please fill the all details first ");
    }
    weight.value = "";
    height.value = "";
    age.value = "";
    gender.selectedIndex = 0;
    activity.selectedIndex = 0;
})
// calculation Section
function BMR(gender, height, weight, age) {
    switch (gender) {
        case "male":
            return 66.47 + (13.75 * +weight) + (5.003 * +height) - (6.755 * +age);
        case "female":
            return 655.1 + (9.563 * +weight) + (1.850 * +height) - (4.676 * +age);
        default:
            alert("You have invalid input Check properly");
            break;
    }
}

// Create meal cards
function create_cards(mealData) {
    recipies_sec.innerHTML = "";
    const { calories } = mealData.nutrients;
    const { meals: mealsArray } = mealData;
    meal_card.innerHTML = "";
    ["breakfast", "lunch", "dinner"].map((e, index) => {
        const svr = `
    <div class="card">
                 <h2 class="heading">${e}</h2>
                 <div class="card_body" style="background-image: url(${images_links[index]});">
                 <div class="card__action">
                    <h2>Meal ${mealsArray[index].title}</h2>
                    <h3>Calories - ${calories.toFixed(0)}</h3>
                    <button onclick="getRecipe(${mealsArray[index].id})" class="recipies_btn">GET RECIPE</button>
                 </div>
                 </div>   
                </div>`;
        meal_card.appendChild(convertHTML(svr));
    });
}
function convertHTML(svr) {
    const div = document.createElement("div");
    div.innerHTML = svr;
    return div.children[0];
}
// for recipies display
async function getRecipe(id) {
    console.log(id)
    const recipie = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${APIKEY}&includeNutrition=false`)
    const recipes = await recipie.json();

    const { extendedIngredients: ingridients } = recipes;
    console.log(ingridients)
    const str = `<table class="recipie_table">
  <thead>
    <tr>
      <th>ingredients</th>
      <th>steps</th>
      <th>quantities</th>
    </tr>
  </thead>
  
</table>
  `;
    let fragments = document.createDocumentFragment();
    fragments.appendChild(convertHTML(str));
    //  console.log(fragments)
    recipie__display.innerHTML = "";
    recipie__display.appendChild(createTable(fragments.children[0], ingridients))
    recipie__display.scrollIntoView({
        behavior: "smooth"
    })
}
// for table function
function createTable(table, arr) {
    let tbody = document.createElement("tbody");
    console.log(tbody)
    arr.forEach((e) => {

        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.innerText = e.name;
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        tr.appendChild(td2)
        let td3 = document.createElement("td");
        td3.innerText = e.measures.metric.amount + e.unit || e.measures.metric.unitLong;
        tr.appendChild(td3);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}



