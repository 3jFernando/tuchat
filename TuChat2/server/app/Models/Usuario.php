<?php

namespace AppCrud\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $fillable =
    [
    	'nombre',
      'entuchat',
      'nombre_usuario',
      'telefono',
      'direccion',
      'estado',
      'clave',
      'correo',
      'foto'
    ];
}
