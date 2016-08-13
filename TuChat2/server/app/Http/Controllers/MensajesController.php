<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;
use AppCrud\Models\Mensaje;
use Illuminate\Support\Facades\Input;

class MensajesController extends Controller
{

  //crear nuevos mensajes
  public function store(Request $request)
  {
    $tiposms    = $request->input('tipo');
    $idRey      = $request->input('usuario_id_rey');
    $idEsc      = $request->input('usuario_id_esclavo');
    $ping       = $request->input('ping');

    if($tiposms == 'text') {

      $mensaje = new Mensaje();
      $mensaje->usuario_id_rey        = $idRey;
      $mensaje->usuario_id_esclavo    = $idEsc;
      $mensaje->mensaje               = $request->input('mensaje');
      $mensaje->ping                  = $ping;
      $mensaje->tipo                  = $tiposms;
      $mensaje->save();

      return response()->json(['mensaje' => 'creado con exito :D']);

    } else if($tiposms == 'img') {

      $aunmento = str_random(16);
      $nombreimgsms = "imgSMS-".$idRey."Y".$idEsc."-".$aunmento.".png";

      $foto = Input::get('foto');
			$path = public_path().'/imgsms/'.$nombreimgsms;
			$img 	= $foto;
			$img  = substr($img, strpos($img, ",")+1);
			$foto = base64_decode($img);
			$success = file_put_contents($path, $foto);

      $mensaje = new Mensaje();
      $mensaje->usuario_id_rey      = $idRey;
      $mensaje->usuario_id_esclavo  = $idEsc;
      $mensaje->mensaje             = $nombreimgsms;
      $mensaje->ping                = $ping;
      $mensaje->tipo                = $tiposms;
      $mensaje->save();

      return response()->json(['mensaje' => 'creado con exito :D']);

    }
  }

  public function show($ping)
  {
    $mensajes = Mensaje::where('ping', '=', $ping)
      ->get();
    if($mensajes->count()) {
        return response()->json(['sihaymensajes' => $mensajes]);
    } else {
        return response()->json(['nohaymensajes' => "no hay mensajes para mostrar"]);
    }
  }

}
