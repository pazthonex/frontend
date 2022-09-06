<?php

namespace App\Http\Middleware;

use Closure;

class authUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = session('token');
        if (empty($token)){
            return redirect('login');
        }
        return $next($request);
    }
}
