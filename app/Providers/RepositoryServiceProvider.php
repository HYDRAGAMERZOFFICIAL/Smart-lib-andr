<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\AdminDataRepository;
use App\Repositories\StudentDataRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(AdminDataRepository::class, function ($app) {
            return new AdminDataRepository();
        });

        $this->app->singleton(StudentDataRepository::class, function ($app) {
            return new StudentDataRepository();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
