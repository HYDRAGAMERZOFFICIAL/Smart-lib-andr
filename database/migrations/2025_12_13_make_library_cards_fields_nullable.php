<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('library_cards', function (Blueprint $table) {
            $table->string('barcode')->nullable()->change();
            $table->date('issued_date')->nullable()->change();
        });
    }

    public function down(): void {
        Schema::table('library_cards', function (Blueprint $table) {
            $table->string('barcode')->change();
            $table->date('issued_date')->change();
        });
    }
};
