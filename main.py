import asyncio
from websockets.sync.client import connect
import websockets.exceptions
import json

from recording import FieldRecorder
import datetime
import os

import fixing_it_in_post
class DashClient:
    
    def __init__(self):
        self.recorder = None
        self.path = ""
        self.telemetry = []
        while True:
            try:
                with connect("ws://192.168.43.1:8000") as websocket:
                    print("Connected to websocket")
                    websocket.send(json.dumps({ "type": 'GET_ROBOT_STATUS' }))
                    while True:
                            try:
                                message = websocket.recv(timeout=1)
                                self.handle_message(json.loads(message), websocket)
                            except TimeoutError as e:
                                # print("Connection closed. Reconnecting...")
                                # print(e)
                                break
                            except websockets.exceptions.ConnectionClosed as e:
                                break
            except ConnectionRefusedError as e:
                print("Connection refused. Retrying...")
                continue
            except TimeoutError as e:
                print("Connection timed out. Retrying...")
                continue

    def handle_message(self, message, websocket):
        if message["type"] == "RECEIVE_ROBOT_STATUS":
            print(f"Recieved robot status: {message}")
            if message["status"]["activeOpModeStatus"] == "INIT"  or message["status"]["activeOpModeStatus"] == "RUNNING":
                if not message["status"]["activeOpMode"] == "$Stop$Robot$":
                    self.start_recording(message["status"]["activeOpMode"])
            if message["status"]["activeOpModeStatus"] == "STOPPED" or message["status"]["activeOpMode"] == "$Stop$Robot$":
                if self.recorder is not None:
                    print("Stopping recording")
                    self.stop_recording()
        elif message["type"] == "RECEIVE_TELEMETRY":
            print(f"Recieved telemetry: {message}")
            if self.recorder is None:
                websocket.send(json.dumps({ "type": 'GET_ROBOT_STATUS' }))
            #else:
            self.add_telemetry(message["telemetry"])
        elif message["type"] == "RECEIVE_IMAGE":
            if self.recorder is not None:
                self.recorder.add_robot_frame(message["imageString"])

        else:
            print(f"Unknown message type: "+message["type"])

    def add_telemetry(self, telemetry):
        for entry in telemetry:
            telemetry_entry = {"timestamp":entry["timestamp"], **entry["data"], "fieldOverlay":entry["fieldOverlay"]}
            self.telemetry.append(telemetry_entry)
    def save_telemetry(self):
        with open(self.path+"/telemetry.json", "w") as f:
            json.dump(self.telemetry, f)
        self.telemetry = []

    def start_recording(self, opmode):
        if self.recorder is None:
            self.path = "dash/public/runs/"+opmode+"_"+datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
            os.makedirs(self.path, exist_ok=True)
            self.recorder = FieldRecorder(self.path)
            print("STARTED RECORDING")
            self.recorder.start_recording()
        
    def stop_recording(self):
        if self.recorder is not None:
            self.recorder.stop_recording()
            self.recorder = None
            self.save_telemetry()
            fip = fixing_it_in_post.FixingItInPost(self.path)
            fip.merge_videos()
            fip.crop_bird()
            





if __name__ == "__main__":
    dash_client = DashClient()