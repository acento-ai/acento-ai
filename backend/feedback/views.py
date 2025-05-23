from flask import Flask, request, Blueprint, jsonify, make_response, render_template
from ..model.transcription import Transcriber
from ..model.feedback import Gemini
from ..model.smile import Smile
from ..model.word_utils import wpm, clean
from ..model.pdf_reader import read_pdf
import io
from flask_cors import cross_origin
import traceback
import subprocess


# Create blueprint for endpoints
bp = Blueprint("feedback", __name__)
feedback_model = Gemini()
transcribe_model = Transcriber()
vocal_feature_model = Smile()

@bp.route("/audio", methods=["POST"])
def audio_feedback():
    if "audio" in request.files:
        audio = request.files["audio"]
    else:
        response = make_response(jsonify("failed to receive file"))
        return response, 400 
    
    if "context" in request.files:
        context = request.files["context"]
    else:
        context = None

    print(audio.filename)
    audio.save("./file")
    audio.close()
    # remember to error handle!
    try:
        transcription = transcribe_model.transcription("./file") # issue is here
    except Exception as e:
        traceback.print_exc()        
        response = make_response(jsonify("failed to load audio"))
        return response, 400

    try: 
        audio_text = ""
        for segment in transcription:
            audio_text += "[%.2fs -> %.2fs] %s\n" % (segment.start, segment.end, segment.text)
            print("[%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
        print("audio", audio_text)
        print(wpm(audio_text))
        feedback = feedback_model.query_gemini_audio_feedback(audio_text, "formal", wpm(audio_text), context) # TODO: fix 2nd and 3rd parameters 
        print(feedback)
    except Exception as e:
        print("error:", e)
        response = make_response(jsonify("failed to generate feedback"))
        return response, 400

    response = make_response(jsonify(clean(feedback)))
    response.headers["Content-Type"] = "application/json"
    return response, 200


@bp.route("/vocal", methods=["POST"])
def vocal_feedback():
    if "vocal" in request.files:
        vocal = request.files["vocal"]
    else:
        response = make_response(jsonify("failed to receive file"))
        return response, 401

    if "context" in request.files:
        context = request.files["context"]
    else:
        context = None

    print(vocal.filename)
    vocal.save("./file")
    vocal.close()
    subprocess.run(["ffmpeg", "-i", "file", "-acodec", "pcm_u8", "-ar", "22050", "song.wav"])
    
    try:
        features, std = vocal_feature_model.feature_extract("./song.wav")
        print(features)
    except Exception as e:
        print("error:", e)
        response = make_response(jsonify("failed to generate features"))
        return response, 402
    
    try:
        feedback = feedback_model.query_gemini_vocal_feedback(features, context)
        print(feedback)

    except Exception as e:
        response = make_response(jsonify("failed to generate feedback"))
        
        return response, 403
        pass

    response = make_response(jsonify(clean(feedback)))
    response = make_response(jsonify(clean(feedback)))
    response.headers["Content-Type"] = "application/json"

    return response, 200


@bp.route("/resume", methods=["POST"])
def resume_feedback():
    if "resume" in request.files:
        resume = request.files["resume"]
        
    else:
        response = make_response(jsonify("failed to receive file"))
        return response, 400 
    
    if "job_description" in request.files:
        job = request.files["job_description"]
    else:
        job = None

    print(resume.filename)
    resume.save("./file")
    resume.close()
    
    try:
        text = read_pdf("./file")
        

    except Exception as e:
        print("error:", e)
        response = make_response(jsonify("failed to generate features"))
        return response, 400
    
    try:
        feedback = feedback_model.query_gemini_resume_feedback(text, job)
        print(feedback)
    except Exception as e:
        response = make_response(jsonify("failed to generate feedback"))
        return response, 400
        pass

    response = make_response(jsonify(clean(feedback)))
    response = make_response(jsonify(clean(feedback)))
    response.headers["Content-Type"] = "application/json"
    return response, 200

