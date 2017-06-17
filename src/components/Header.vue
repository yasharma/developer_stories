<template>
	<nav class="nav has-shadow">
	  	<div class="container">
			<div class="nav-left">
			  	<a class="nav-item"> Developer Stream </a>
			</div>
	    	<span class="nav-toggle">
		     	<span></span>
		     	<span></span>
		     	<span></span>
	    	</span>
	    	<div class="nav-right nav-menu">
	    		<router-link 
	    			class="nav-item" 
	    			:to="{ name: 'home' }" exact> Home 
	    		</router-link>
	    		<router-link 
	    			class="nav-item" 
	    			:to="{ name: 'login' }"> Login 
	    		</router-link>
	      		<!-- <a class="nav-item is-tab">
	        		<figure class="image is-16x16" style="margin-right: 8px;">
	          			<img src="http://bulma.io/images/jgthms.png">
	        		</figure>
        			Profile
	      		</a>
	      		<a class="nav-item is-tab">Log out</a> -->
	    	</div>
	  	</div>
	</nav>
</template>

