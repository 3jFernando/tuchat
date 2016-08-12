<?php

namespace AppCrud\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $fillable = [
      'usuario_id_rey',
      'usuario_id_esclavo',
      'estado'
    ];
}
