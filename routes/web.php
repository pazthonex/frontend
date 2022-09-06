<?php
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// dashboard Routes
Route::get('/','DashboardController@dashboardEcommerce')->middleware("authuser");




Route::group(['prefix' => 'users','middleware' => ['authuser']], function() {
    Route::get('/','UsersController@users');
});


// Route::get('/dashboard-ecommerce','DashboardController@dashboardEcommerce');
// Route::get('/dashboard-analytics','DashboardController@dashboardAnalytics');


// Authentication  Route
Route::get('/logins','AuthenticationController@loginPage');
Route::get('/logout','AuthenticationController@logout');
Route::get('/admin/login','AuthenticationController@authLockPage')->name('admin.login');
Route::post('/adminlogin','AuthenticationController@adminlogin');


// Miscellaneous
Route::get('/page-coming-soon','MiscellaneousController@comingSoonPage');
Route::get('/error-404','MiscellaneousController@error404Page');
Route::get('/error-500','MiscellaneousController@error500Page');
Route::get('/page-not-authorized','MiscellaneousController@notAuthPage');
Route::get('/page-maintenance','MiscellaneousController@maintenancePage');

Route::get('auth/google', 'AuthenticationController@redirectToGoogle')->name('google.signin'); 
Route::get('auth/google/callback', 'AuthenticationController@handleGoogleCallback');

Auth::routes();

