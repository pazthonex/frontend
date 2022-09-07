@extends('layouts.contentLayoutMaster')
{{-- page Title --}}
@section('title','Dashboard Ecommerce')
{{-- vendor css --}}
@section('vendor-styles')
<link rel="stylesheet" type="text/css" href="{{asset('vendors/css/charts/apexcharts.css')}}">
<link rel="stylesheet" type="text/css" href="{{asset('vendors/css/extensions/swiper.min.css')}}">
@endsection
@section('page-styles')
<link rel="stylesheet" type="text/css" href="{{asset('css/pages/dashboard-ecommerce.css')}}">
@endsection

@section('content')
<!-- Dashboard Ecommerce Starts -->
<section id="dashboard-ecommerce">
    <div class="row">
      <!-- Greetings Content Starts -->
      <div class="col-xl-12 col-md-6 col-12 dashboard-greetings">
        <div class="card">
          <div class="card-header">
            <h3 class="greeting-text">Congratulations {{ session('name') }} !</h3>
            <p class="mb-0">Best seller of the month</p>
          </div>
          <div class="card-content">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-end">
                <div class="dashboard-content-left">
                  <h1 class="text-primary font-large-2 text-bold-500">$89k</h1>
                  <p>You have done 57.6% more sales today.</p>
                  <button type="button" class="btn btn-primary glow">View Sales</button>
                </div>
                <div class="dashboard-content-right">
                  <img src="{{asset('images/icon/cup.png')}}" height="220" width="220" class="img-fluid"
                    alt="Dashboard Ecommerce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</section>
<!-- Dashboard Ecommerce ends -->
@endsection

@section('vendor-scripts')
<script src="{{asset('vendors/js/charts/apexcharts.min.js')}}"></script>
<script src="{{asset('vendors/js/extensions/swiper.min.js')}}"></script>
@endsection

@section('page-scripts')
<script src="{{asset('js/scripts/pages/dashboard-ecommerce.js')}}"></script>
@endsection

