<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('library_cards', function (Blueprint $table) {
            DB::statement("ALTER TABLE library_cards MODIFY status ENUM('active', 'inactive', 'lost', 'pending_replacement') DEFAULT 'active'");
        });
    }

    public function down(): void {
        Schema::table('library_cards', function (Blueprint $table) {
            DB::statement("ALTER TABLE library_cards MODIFY status ENUM('active', 'inactive', 'lost') DEFAULT 'active'");
        });
    }
};
