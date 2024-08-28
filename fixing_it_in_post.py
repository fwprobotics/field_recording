
import json
import datetime
import cv2
import numpy as np
import imutils

class FixingItInPost:
    def __init__(self, path):
        self.path =path
        self.telemetry = json.load(open(self.path+"/telemetry.json"))
    def get_closest_telemetry(self, timestamp):
        last = self.telemetry[0]
        for entry in self.telemetry:
            if entry["timestamp"] > timestamp:
                return last
            last = entry
        return last
    def merge_videos(self):
        # start_time = datetime.datetime.strptime(self.path.split("/")[-1].split("_")[1], "%Y-%m-%d-%H-%M-%S").timestamp()*1000
        start_time = self.telemetry[0]["timestamp"]
        cap_bird = cv2.VideoCapture(self.path+"/bird.mp4")
        cap_close = cv2.VideoCapture(self.path+"/close.mp4")
        cap_robot = cv2.VideoCapture(self.path+"/robot.mp4")

        out = cv2.VideoWriter(self.path+"/merged.mp4", cv2.VideoWriter_fourcc('a', 'v', 'c', '1'), 10, (1280, 720))
        while cap_bird.isOpened():
            ret, frame_bird = cap_bird.read()
            ret, frame_close = cap_close.read()
            ret, frame_robot = cap_robot.read()
            if not ret:
                break
            timestamp = start_time + cap_bird.get(cv2.CAP_PROP_POS_MSEC)
            telemetry = self.get_closest_telemetry(timestamp)
            print(telemetry, timestamp, cap_bird.get(cv2.CAP_PROP_POS_MSEC))
            if telemetry["current_camera"] == "bird":
                cv2.putText(frame_bird, "CURRENT ANGLE: BIRD'S EYE", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(frame_bird, f"CURRENT STATE: {telemetry['state']}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                out.write(frame_bird)
            elif telemetry["current_camera"] == "close":
                cv2.putText(frame_close, "CURRENT ANGLE: CLOSEUP", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(frame_close, f"CURRENT STATE: {telemetry['state']}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                out.write(frame_close)
            elif telemetry["current_camera"] == "robot":
                cv2.putText(frame_robot, "CURRENT ANGLE: ROBOT", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
                cv2.putText(frame_robot, f"CURRENT STATE: {telemetry['state']}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

                out.write(frame_robot)
            # cv2.putText(frame_close, str(telemetry["rightMotorPower"]), (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
        cap_bird.release()
        cap_close.release()
        cap_robot.release()
        out.release()
     #   print (self.get_closest_telemetry(datetime.datetime.strptime( self.path.split("/")[1].split("_")[1], "%Y-%m-%d-%H-%M-%S").timestamp()))
    def crop_bird(self):
        cap = cv2.VideoCapture(self.path+"/bird.mp4")
        out = cv2.VideoWriter(self.path+"/cropped.mp4", cv2.VideoWriter_fourcc('a', 'v', 'c', '1'), 10, (400, 400))
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame = imutils.resize(frame, width=500)
            pt1 = np.float32([[175, 47], [365, 52], [129, 200], [407, 204]])
            height, width = 400, 400
            pt2 = np.float32([[0, 0], [width, 0], [0, height], [width, height]])
            matrix = cv2.getPerspectiveTransform(pt1, pt2)
            frame = cv2.warpPerspective(frame, matrix, (width, height))
            out.write(frame)
        cap.release()
        out.release()

    
        
if __name__ == "__main__":
    fip = FixingItInPost("dash/public/runs/TeleOpTest_2024-08-27-13-31-51")
    fip.merge_videos()
    fip.crop_bird()