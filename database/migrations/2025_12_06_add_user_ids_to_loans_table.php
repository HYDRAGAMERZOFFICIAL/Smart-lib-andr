<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('loans', function (Blueprint $table) {
            $table->foreignId('issued_by_id')->nullable()->after('book_id')->constrained('users')->onDelete('set null');
            $table->foreignId('returned_by_id')->nullable()->after('issued_by_id')->constrained('users')->onDelete('set null');
        });
    }

    public function down(): void {
        Schema::table('loans', function (Blueprint $table) {
            $table->dropForeign(['issued_by_id']);
            $table->dropForeign(['returned_by_id']);
            $table->dropColumn(['issued_by_id', 'returned_by_id']);
        });
    }
};
