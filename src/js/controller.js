import * as model from './model.js'
import recipeView from './views/recepieView.js'
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { async } from 'regenerator-runtime';
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
    bookmarksView.update(model.state.bookmarks)

    // Loading Recipe
    await model.loadRecipe(id);
    const recipe = model.state.recipe
    console.log(recipe);
    // Rendering recipe
    recipeView.render(model.state.recipe)
  } catch (err) {
    recipeView.renderError()
    console.error(err);
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
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  // render recipe view
  recipeView.render(model.state.recipe)
  // render bookmarks
  console.log(model.state.bookmarks);
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = function (newRecipe) {
  console.log(newRecipe);
  // Upload the recipe date
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
}
init()