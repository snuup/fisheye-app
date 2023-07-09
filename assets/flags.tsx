/** @jsx h */
import { mount } from '../utils/common'
import { createDom, h } from './hyperaw'

const flag1 = (color: string) => (
    <svg class="flag" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 284.822 284.822" xml: space="preserve">
        <g>
            <path style={`fill:${color}`} d="M75.326,28.49c13.086-7.789,38.851-18.933,66.291-7.511c37.519,15.61,50.872,46.515,107.775,5.635
		c4.879-3.508,8.697-1.675,8.697,4.335v106.513c0,6.01-3.307,14.462-7.854,18.389c-9.91,8.561-28.011,21.299-47.429,20.696
		c-29.11-0.914-57.311-31.84-83.696-31.84c-16.845,0-33.684,8.153-43.659,14.055c-5.173,3.057-9.1,1.082-9.1-4.922V45.498
		C66.357,39.493,70.164,31.563,75.326,28.49z"/>
            <path style="fill:#333" d="M42.702,0c-8.817,0-15.969,7.152-15.969,15.969c0,2.263,0.479,4.411,1.333,6.347
		c1.452,3.302,3.758,10.16,3.758,16.165v235.463c0,6.005,4.873,10.878,10.878,10.878s10.878-4.873,10.878-10.878V38.481
		c0-6.005,2.306-12.858,3.753-16.165c0.854-1.936,1.333-4.085,1.333-6.347C58.671,7.158,51.524,0,42.702,0z"/>
        </g>
    </svg>
)

export const defsFilter = createDom(
    <defs id="fdef">
        <filter x="0" y="0" width="1" height="1" id="solid">
            <feFlood flood-color="#eee"></feFlood>
            <feComposite in="SourceGraphic" operator="xor"></feComposite>
        </filter>
    </defs>
)

export const flag = (color: string) => {
    return createDom(flag1(color))
}

mount({ flag })