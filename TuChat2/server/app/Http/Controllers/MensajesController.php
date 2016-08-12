<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;
use AppCrud\Models\Mensaje;

class MensajesController extends Controller
{

  //crear nuevos mensajes
  public function store(Request $request)
  {
    $mensaje = new Mensaje();
    $mensaje->usuario_id_rey      = $request->input('usuario_id_rey');
    $mensaje->usuario_id_esclavo  = $request->input('usuario_id_esclavo');
    $mensaje->mensaje             = $request->input('mensaje');
    $mensaje->ping                = $request->input('ping');
    $mensaje->tipo                = $request->input('tipo');
    $mensaje->save();
    return response()->json(['mensaje' => 'creado con exito :D']);
  }

  public function show($ping)
  {
    $mensajes = Mensaje::where('ping', '=', $ping)
      ->get();
    return response()->json(['mensajes' => $mensajes]);
  }

}
