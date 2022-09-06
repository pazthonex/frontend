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
        $photo = $user->avatar;
        $findemployee = Http::withToken(env('Auth_HRMIS_Token'))->post(env('APP_HRMIS_API') . "/api/auth/findemail", [  "email" => $email,   'photo' => $photo  ])->json();
        if($findemployee['status'] == 200){
          $role = $findemployee['data']['role'];
          $campus = $findemployee['data']['campus'];
          $name = $findemployee['data']['firstname'].' '.$findemployee['data']['lastname'];
          $employee_id = $findemployee['data']['employee_id'];
          $data = [
            'role'=>$role,
            'campus'=> $campus,
            'name'=>$name,
            'employee_id'=>$employee_id,
          ];
          $createToken = Http::post(env('APP_API'). "/api/createtoken",['data' => $data])->json();

          if($createToken['status'] == 200){
             session([
              'token' => $createToken['message']['token'],
               'name' => $createToken['message']['name'],
           ]);
           return redirect('/');
          }
          dd($createToken);
        }else if($findemployee['status'] == 400){
          $error = $findemployee['message'];
          $pageConfigs = ['bodyCustomClass' => 'bg-full-screen-image'];
          return view('pages.auth-login', ['pageConfigs' => $pageConfigs], compact('error'));
        }
      

      }

      dd('NO user found');

     

     

      //dd($response);
    //   $findemployee = Http::withToken(env('Auth_Token'))->post($this->api . "/api/auth/findemail", [
    //     "email" => $user->email,
    //     'photo' => $user->avatar
    //   ])->json();
     
    //   if ($findemployee['status'] == 400) {
    //     $pageConfigs = ['bodyCustomClass' => 'bg-full-screen-image'];
    //     $error = $findemployee['message'];
    //     return view('auth.auth-login', compact('error'), ['pageConfigs' => $pageConfigs]);
    //   } else if ($findemployee['status'] == 200) {
    //   //  event(new AutoLogOut($findemployee['data']['employee_id']));
    //     session([
    //       'token' => $findemployee['data']['token'],
    //       'firstname' => $findemployee['data']['firstname'],
    //       'lastname' => $findemployee['data']['lastname'],
    //       'role' => $findemployee['data']['role'],
    //       'id' => $findemployee['data']['employee_id'],
    //       'campus' => $findemployee['data']['campus'],
    //       'sessionempid' => $findemployee['data']['employee_id'],
    //       'photo' => $user->avatar,
    //       'validator' => $findemployee['data']['validator'],
    //       'isAuthorizedPersonel' => $findemployee['data']['is_authorized_personel'],
    //       'isAuthorizedOfficial' => $findemployee['data']['is_authorized_official'],
    //       'pat_id' =>  $findemployee['data']['patId'],
    //     ]);
    //     return redirect('/');
    //   }
    //    else {
    //     $pageConfigs = ['bodyCustomClass' => 'bg-full-screen-image'];
    //     $error = 'Server Error';
    //     return view('auth.auth-login', ['pageConfigs' => $pageConfigs, 'error' => $error]);
    //   }
    // } catch (Exception $e) {
    //   return redirect('auth/google');
    // }
  }


}
