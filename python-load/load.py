#!/usr/bin/python3
"""
Produces load on all available CPU cores
Updated with suggestion to prevent Zombie processes
Linted for Python 3
Source:
insaner @ https://danielflannery.ie/simulate-cpu-load-with-python/#comment-34130
"""
import numpy
from multiprocessing import Pool
from multiprocessing import cpu_count
import signal

# Change the xrange (allocation) value accordingly.
allocation = 1512

stop_loop = 0
def exit_chld(x, y):
    global stop_loop
    stop_loop = 1

def f(x):
    global stop_loop
    while not stop_loop:
        x*x
        [numpy.random.bytes(1024*1024) for x in range(allocation)]
signal.signal(signal.SIGINT, exit_chld)

if __name__ == '__main__':
    processes = cpu_count()
    print('-' * 20)
    print('Running load on CPU(s)')
    print('Utilizing %d cores' % processes)
    print('-' * 20)
    pool = Pool(processes)
    pool.map(f, range(processes))
