from subpackages.addition import add
from subpackages.subtraction import sub
from subpackages.multiplication import mul
from subpackages.division import div

def addition(a, b): lambda a, b: add(a, b) 

def subtraction(a, b): lambda a, b: sub(a,b) 

def multiplication(a, b): lambda a, b: mul(a,b)

def division(a, b): lambda a, b: div(a,b)

