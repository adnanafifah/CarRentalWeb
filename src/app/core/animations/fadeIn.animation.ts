// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style, query } from '@angular/animations';

export const fadeInAnimation =
	// trigger name for attaching this animation to an element using the [@triggerName] syntax
	trigger('fadeInAnimation', [
		transition('* <=> *', [
			// Initial state of new route
			query(':enter',
				style({
					position: 'fixed',
					width: '100%',
					opacity: 0,
					transform: 'translateY(20%)'
				}),
				{ optional: true }),

			// move page in screen from left to right
			query(':enter',
				animate('500ms ease-in',
					style({
						opacity: 1,
						transform: 'translateY(0%)'
					})
				),
				{ optional: true }),
		])
	]);
