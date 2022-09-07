<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\AESCipher;
use Socialite;

class AuthenticationController extends Controller
{
  //Login page
  // public function loginPage(){
  //   $pageConfigs = ['bodyCustomClass'=> 'bg-full-screen-image'];
  //   return view('pages.auth-login',['pageConfigs' => $pageConfigs]);
 // }
  //Register page
  public function registerPage(){
    $pageConfigs = ['bodyCustomClass'=> 'bg-full-screen-image'];
    return view('pages.auth-register',['pageConfigs' => $pageConfigs]);
  }
   //forget Password page
   public function forgetPasswordPage(){
    $pageConfigs = ['bodyCustomClass'=> 'bg-full-screen-image'];
    return view('pages.auth-forgot-password',['pageConfigs' => $pageConfigs]);
  }
   //reset Password page
   public function resetPasswordPage(){
    $pageConfigs = ['bodyCustomClass'=> 'bg-full-screen-image'];
    return view('pages.auth-reset-password',['pageConfigs' => $pageConfigs]);
  }
   //auth lock page
   public function authLockPage(){
    $pageConfigs = ['bodyCustomClass'=> 'bg-full-screen-image'];
    return view('pages.auth-lock-screen',['pageConfigs' => $pageConfigs]);
  }
  public function adminlogin(Request $request){
      $email = $request->email;
      $password = $request->password;
      $login = Http::post(env('APP_API'). "/api/login", [
        'email' => $email,
        'password' => $password,
      ])->json();
     if($login){
        if ($login['status'] == 200) {
          session([
            'token' => $login['data']['token'],
            'email' => $login['data']['email'],
          ]);
          return redirect('/');
        }
        if($login['status'] == 400){
          $error = $login['message'];
         // return redirect()->route('admin.login')->with( ['error' => $error ] );
          return view('pages.auth-lock-screen', compact('error'));
        }
      }
  }
  //frontend
  public function logout(){
    $logout = Http::withToken(session('token'))->post(env('APP_API') . "/api/logout")->json();
    if (!empty($logout)) {
      if ($logout['status'] == 200) {
        session()->flush();
        return redirect('/login');
      }
    }
  }
  
  public function loginPage()
  {
    if (!empty(session('token'))) {
      return redirect('/');
    }
    $pageConfigs = ['bodyCustomClass' => 'bg-full-screen-image'];
    return view('pages.auth-login', ['pageConfigs' => $pageConfigs]);
  }
  public function redirectToGoogle()
  {
    return Socialite::driver('google')->redirect();
  }
  public function handleGoogleCallback()
  {
      $user = Socialite::driver('google')->user(); 
      if($user){
        $email = $user->email;
        $login = Http::post(env('APP_API'). "/api/loginbygoogle",['email' => $email])->json();
        if(!empty($login)){
          if($login['status'] == 200){
            session([
              'token' => $login['data']['token'],
              'name' => $login['data']['name'],
              'role' => $login['data']['role'],
              'photo' => $login['data']['photo'],
            ]);
            return redirect('/');
         }
        }
        $pageConfigs = ['bodyCustomClass' => 'bg-full-screen-image'];
        return view('pages.auth-login', ['pageConfigs' => $pageConfigs]);

      }
  }


}
