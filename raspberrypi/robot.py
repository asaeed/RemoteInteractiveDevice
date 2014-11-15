
from socketIO_client import SocketIO, BaseNamespace
import time
import serial
import logging
import threading
import netifaces
import schedule
import json

serialPort = serial.Serial(port='/dev/ttyACM0',baudrate='9600')
logging.basicConfig()

class Namespace(BaseNamespace):
	def on_connect(self):
		print '[Connected]'
		self.emit('init', {'ip': getIp(), 'type': 'robot'})
		
		# anything to run on start
		serialPort.write('x0\n')
		serialPort.write('y0\n')
		self.emit('controls', {'xSlider': 0})
		self.emit('controls', {'ySlider': 0})

	def on_disconnect(self):
		print '[Disconnected]'

	def on_message(self, data):
		print '[Message] %s: %s' % (id, message)

	def on_controls(self, *args):
		print 'controls event', args
		
		if 'xSlider' in args[0]:
			serialPort.write('x' + str(args[0]['xSlider']) + "\n")
		if 'ySlider' in args[0]:
			serialPort.write('y' + str(args[0]['ySlider']) + "\n")

def requestMotionValue():
	print "requesting motion value"
	serialPort.write('m0\n')

def getIp():
	if 2 in netifaces.ifaddresses('eth0'):
		return netifaces.ifaddresses('eth0')[2][0]['addr']
	else:
		return netifaces.ifaddresses('wlan0')[2][0]['addr']

def main():

	print 'my ip: ' + getIp()
	try:

		# initialize serial port
		serialPort.flushInput()

		# initialize socket.io
		socketIO = SocketIO('livestream.labsmb.com', 8080, Namespace)
		#socketIO.wait(seconds=99999999)
		t = threading.Thread(target=socketIO.wait, args=(99999999,))
		t.daemon = True
		t.start()

		# scheduled requests
		#schedule.every(10).seconds.do(requestMotionValue)

		while True:
			
			# look for incoming serial data
			if (serialPort.inWaiting() > 0):
				try:
					result = serialPort.readline().replace("\n", "")
					print result
					
					# send it to webserver over socketio
					socketIO.emit('sensors', json.loads(result))
					
				except: # serial.serialutil.SerialException:
					pass
			
			#schedule.run_pending()
			time.sleep(0.5)

	except KeyboardInterrupt:
		serialPort.close()
		print "Done..."

if __name__ == "__main__":
	main()