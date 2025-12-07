<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class RemoveUserAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:remove-admin {email : The email of the admin to demote}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove admin privileges from a user by their email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("User with email {$email} not found!");
            return 1;
        }
        
        if ($user->role !== 'admin') {
            $this->info("User {$user->name} is not an admin!");
            return 0;
        }
        
        $user->role = 'member';
        $user->save();
        
        $this->info("Admin privileges have been removed from {$user->name} successfully!");
        
        return 0;
    }
}
