<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use Illuminate\Support\Facades\Input;
use AppCrud\Http\Controllers\Controller;

use AppCrud\Models\Usuario;

class FotoUsuarioController extends Controller
{
  //actualizar fotografia del usuario
  public function update($id) {

			$foto = Input::get('foto');

			$usuario = Usuario::find($id);
			$usuario->foto 	= 'tuchat-'.$id.".png";
			$usuario->save();

			$path = public_path().'/resouce/'.'tuchat-'.$id.".png";
			$img 	= $foto;
			$img  = substr($img, strpos($img, ",")+1);
			$foto = base64_decode($img);
			$success = file_put_contents($path, $foto);

		}
}
