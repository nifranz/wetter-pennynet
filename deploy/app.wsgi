#! /usr/bin/python

import logging
import sys
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0, '/home/niklas/code/apps/python-backend')
from app import app as application
application.secret_key = 'anything you wish'
