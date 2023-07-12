import { async } from 'regenerator-runtime';
import * as model from './model.js'
import recipeView from './views/recepieView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';


// if (module.hot) {
//   module.hot.accept();
// }


const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return
    recipeView.renderSpinner()

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Loading Recipe
    await model.loadRecipe(id);
    const recipe = model.state.recipe
    console.log(recipe);
    // Rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
  }


}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // Get search
    const query = searchView.getQuery();
    if (!query) return;

    // Load result
    await model.loadSearchResult(query);

    // Render result
    resultsView.render(model.getSearchResultsPage(1))
    // Render the initial pagination btns
    paginationView.render(model.state.search)
  }
  catch (err) {
    console.log(err);
  }
}

const controlPagination = function (goToPage) {
  // Render NEW result
  resultsView.render(model.getSearchResultsPage(goToPage))
  // Render the NEW initial pagination btns
  paginationView.render(model.state.search)
}

const controlServings = function (newServings) {
  // Update the recipe servings (state)
  model.updateServings(newServings)
  // Update the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.render(model.state.recipe)
}

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

}
init()